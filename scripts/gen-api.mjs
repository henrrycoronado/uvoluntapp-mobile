#!/usr/bin/env node
/**
 * gen-api.mjs — Lightweight OpenAPI → TypeScript codegen.
 *
 * Reads contracts/openapi.yaml (copied from uvoluntapp-backend) and emits:
 *   - types.ts   — All schemas as TypeScript interfaces.
 *   - client.ts  — Typed fetch wrappers for every operation.
 *
 * No Java, no TypeScript compiler API — just YAML parse + string emit.
 * Compatible with any Node ≥ 18 and any TypeScript version.
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync, existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import YAML from 'yaml'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')
const contractPath = resolve(projectRoot, 'contracts/openapi.yaml')
const outputDir = resolve(projectRoot, 'src/shared/api/generated')

// ── Copy contract from the backend repo ─────────────────
const backendContract =
  process.env.BACKEND_CONTRACT ??
  resolve(homedir(), 'Documents/GitHub/uvoluntapp-backend/contracts/openapi.yaml')
if (!existsSync(backendContract)) {
  console.error(`ERROR: backend contract not found at ${backendContract}`)
  console.error('Set BACKEND_CONTRACT or clone uvoluntapp-backend next to this repo.')
  process.exit(1)
}
mkdirSync(dirname(contractPath), { recursive: true })
copyFileSync(backendContract, contractPath)
console.log('✓ Contract copied from backend')

// ── Parse spec ──────────────────────────────────────────
const spec = YAML.parse(readFileSync(contractPath, 'utf-8'))
const schemas = spec.components?.schemas ?? {}
const paths = spec.paths ?? {}

// ── Helpers ─────────────────────────────────────────────

function refToName(ref) {
  return ref.split('/').pop()
}

/** Resolve $ref pointers in the spec (components/schemas, components/parameters, etc.) */
function resolveRef(obj) {
  if (!obj || typeof obj !== 'object') return obj
  if (obj.$ref) {
    const parts = obj.$ref.replace('#/', '').split('/')
    let resolved = spec
    for (const part of parts) {
      resolved = resolved?.[part]
    }
    return resolved ?? obj
  }
  return obj
}

function schemaToTs(schema, indent = '') {
  if (!schema) return 'unknown'

  if (schema.$ref) return refToName(schema.$ref)

  if (schema.allOf) {
    return schema.allOf.map(s => schemaToTs(s, indent)).join(' & ')
  }
  if (schema.oneOf) {
    return schema.oneOf.map(s => schemaToTs(s, indent)).join(' | ')
  }
  if (schema.anyOf) {
    return schema.anyOf.map(s => schemaToTs(s, indent)).join(' | ')
  }
  if (schema.enum) {
    return schema.enum.map(v => JSON.stringify(v)).join(' | ')
  }

  switch (schema.type) {
    case 'string':
      if (schema.format === 'date-time') return 'string'
      if (schema.format === 'uuid') return 'string'
      return 'string'
    case 'integer':
    case 'number':
      return 'number'
    case 'boolean':
      return 'boolean'
    case 'array':
      return `Array<${schemaToTs(schema.items, indent)}>`
    case 'object': {
      if (schema.additionalProperties && !schema.properties) {
        return `Record<string, ${schemaToTs(schema.additionalProperties, indent)}>`
      }
      const props = schema.properties ?? {}
      const required = new Set(schema.required ?? [])
      const inner = indent + '  '
      const lines = Object.entries(props).map(([k, v]) => {
        const opt = required.has(k) ? '' : '?'
        const desc = v.description ? `/** ${v.description} */\n${inner}` : ''
        return `${inner}${desc}${k}${opt}: ${schemaToTs(v, inner)}`
      })
      if (lines.length === 0) return 'Record<string, unknown>'
      return `{\n${lines.join('\n')}\n${indent}}`
    }
    default:
      return 'unknown'
  }
}

function pascalCase(str) {
  return str.replace(/(^|[^a-zA-Z0-9])([a-zA-Z])/g, (_, _sep, c) => c.toUpperCase())
}

// ── Generate types.ts ──────────────────────────────────

let typesContent = `/* eslint-disable */\n/* prettier-ignore */\n/* Auto-generated from contracts/openapi.yaml — DO NOT EDIT */\n\n`

for (const [name, schema] of Object.entries(schemas)) {
  if (schema.description) {
    typesContent += `/** ${schema.description} */\n`
  }
  if (schema.enum) {
    typesContent += `export type ${name} = ${schema.enum.map(v => JSON.stringify(v)).join(' | ')}\n\n`
  } else {
    typesContent += `export interface ${name} ${schemaToTs(schema)}\n\n`
  }
}

// ── Generate client.ts ─────────────────────────────────

let clientContent = `/* eslint-disable */\n/* prettier-ignore */\n/* Auto-generated from contracts/openapi.yaml — DO NOT EDIT */\n\n`
clientContent += `import type * as T from './types'\n\n`
clientContent += `export type FetchImpl = (url: string, init: { method: string; headers: Record<string, string>; body?: string }) => Promise<Response>\n\n`
clientContent += `let baseUrl = '/api/v1'\nlet fetchImpl: FetchImpl = (url, init) => fetch(url, init)\n\n`
clientContent += `/** Injects the base URL and the transport (auth, refresh, error mapping) used by every operation. */\n`
clientContent += `export function configure(opts: { baseUrl?: string; fetch?: FetchImpl }) {\n`
clientContent += `  if (opts.baseUrl !== undefined) baseUrl = opts.baseUrl\n`
clientContent += `  if (opts.fetch !== undefined) fetchImpl = opts.fetch\n`
clientContent += `}\n\n`
clientContent += `async function request<T>(method: string, path: string, opts?: { body?: unknown; query?: Record<string, string | undefined> }): Promise<T> {\n`
clientContent += `  let url = baseUrl + path\n`
clientContent += `  if (opts?.query) {\n`
clientContent += `    const parts: string[] = []\n`
clientContent += `    for (const [k, v] of Object.entries(opts.query)) {\n`
clientContent += `      if (v !== undefined) parts.push(encodeURIComponent(k) + '=' + encodeURIComponent(v))\n`
clientContent += `    }\n`
clientContent += `    if (parts.length) url += '?' + parts.join('&')\n`
clientContent += `  }\n`
clientContent += `  const res = await fetchImpl(url, {\n`
clientContent += `    method,\n`
clientContent += `    headers: { 'Content-Type': 'application/json' },\n`
clientContent += `    body: opts?.body !== undefined ? JSON.stringify(opts.body) : undefined,\n`
clientContent += `  })\n`
clientContent += `  if (res.status === 204) return undefined as T\n`
clientContent += `  return (await res.json()) as T\n`
clientContent += `}\n\n`

const methods = ['get', 'post', 'put', 'patch', 'delete']

/** Resolve a schema to a TypeScript type string with T. prefix for named types */
function resolveResponseType(schema) {
  if (!schema) return 'void'
  if (schema.$ref) return `T.${refToName(schema.$ref)}`
  if (schema.type === 'array' && schema.items) {
    return `Array<${resolveResponseType(schema.items)}>`
  }
  // Inline object — unlikely for responses, but handle gracefully
  return schemaToTs(schema)
}

for (const [pathStr, pathItem] of Object.entries(paths)) {
  for (const method of methods) {
    const op = pathItem[method]
    if (!op) continue
    const operationId = op.operationId ?? `${method}${pascalCase(pathStr)}`

    // Response type
    let responseType = 'void'
    const okResponse = op.responses?.['200'] ?? op.responses?.['201']
    if (okResponse?.content?.['application/json']?.schema) {
      const rSchema = okResponse.content['application/json'].schema
      responseType = resolveResponseType(rSchema)
    }

    // Request body type
    let bodyType = null
    if (op.requestBody?.content?.['application/json']?.schema) {
      const bs = op.requestBody.content['application/json'].schema
      bodyType = bs.$ref ? `T.${refToName(bs.$ref)}` : schemaToTs(bs)
    }

    // Path params — resolve $ref
    const allParams = [...(pathItem.parameters ?? []), ...(op.parameters ?? [])].map(resolveRef)
    const pathParams = allParams.filter(p => p.in === 'path')
    const queryParams = allParams.filter(p => p.in === 'query')

    // Build function signature
    const funcParams = []
    for (const p of pathParams) {
      funcParams.push(`${p.name}: string`)
    }
    if (bodyType) {
      funcParams.push(`body: ${bodyType}`)
    }
    if (queryParams.length > 0) {
      const qFields = queryParams.map(q => `${q.name}${q.required ? '' : '?'}: string`).join('; ')
      funcParams.push(`query?: { ${qFields} }`)
    }

    // Build URL with interpolation
    let urlExpr = `'${pathStr}'`
    if (pathParams.length > 0) {
      urlExpr = '`' + pathStr.replace(/{([^}]+)}/g, (_, name) => '${' + name + '}') + '`'
    }

    // Description
    if (op.summary) {
      clientContent += `/** ${op.summary} */\n`
    }
    clientContent += `export function ${operationId}(${funcParams.join(', ')}): Promise<${responseType}> {\n`
    const reqOpts = []
    if (bodyType) reqOpts.push('body')
    if (queryParams.length > 0) reqOpts.push('query')
    const optsArg = reqOpts.length > 0 ? `, { ${reqOpts.join(', ')} }` : ''
    clientContent += `  return request('${method.toUpperCase()}', ${urlExpr}${optsArg})\n`
    clientContent += `}\n\n`
  }
}

// ── Write output ───────────────────────────────────────

rmSync(outputDir, { recursive: true, force: true })
mkdirSync(outputDir, { recursive: true })
writeFileSync(resolve(outputDir, 'types.ts'), typesContent)
writeFileSync(resolve(outputDir, 'client.ts'), clientContent)
writeFileSync(resolve(outputDir, 'index.ts'), `/* eslint-disable */\n/* Auto-generated — DO NOT EDIT */\nexport * from './types'\nexport * from './client'\n`)

console.log(`✓ Generated ${Object.keys(schemas).length} schemas and ${clientContent.split('\nexport function ').length - 1} operations`)
