/* eslint-disable */
/* prettier-ignore */
/* Auto-generated from contracts/openapi.yaml — DO NOT EDIT */

import type * as T from './types'

export type FetchImpl = (url: string, init: { method: string; headers: Record<string, string>; body?: string }) => Promise<Response>

let baseUrl = '/api/v1'
let fetchImpl: FetchImpl = (url, init) => fetch(url, init)

/** Injects the base URL and the transport (auth, refresh, error mapping) used by every operation. */
export function configure(opts: { baseUrl?: string; fetch?: FetchImpl }) {
  if (opts.baseUrl !== undefined) baseUrl = opts.baseUrl
  if (opts.fetch !== undefined) fetchImpl = opts.fetch
}

async function request<T>(method: string, path: string, opts?: { body?: unknown; query?: Record<string, string | undefined> }): Promise<T> {
  let url = baseUrl + path
  if (opts?.query) {
    const parts: string[] = []
    for (const [k, v] of Object.entries(opts.query)) {
      if (v !== undefined) parts.push(encodeURIComponent(k) + '=' + encodeURIComponent(v))
    }
    if (parts.length) url += '?' + parts.join('&')
  }
  const res = await fetchImpl(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: opts?.body !== undefined ? JSON.stringify(opts.body) : undefined,
  })
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

/** Registrar una cuenta nueva */
export function register(body: T.RegisterRequest): Promise<T.RegisterResponse> {
  return request('POST', '/auth/register', { body })
}

/** Verificar OTP de registro */
export function verifyOtp(body: T.VerifyOtpRequest): Promise<T.VerifyOtpResponse> {
  return request('POST', '/auth/verify-otp', { body })
}

/** Completar registro de cuenta externa */
export function completeRegistration(body: T.CompleteRegistrationRequest): Promise<T.MessageResponse> {
  return request('POST', '/auth/complete-registration', { body })
}

/** Iniciar sesión con correo y contraseña */
export function login(body: T.LoginRequest): Promise<T.TokenResponse> {
  return request('POST', '/auth/login', { body })
}

/** Enviar una nueva solicitud tras un rechazo */
export function reapply(body: T.ReapplyRequest): Promise<T.MessageResponse> {
  return request('POST', '/auth/reapply', { body })
}

/** Crear la primera contraseña de una cuenta creada con Google */
export function setPassword(body: T.SetPasswordRequest): Promise<T.SetPasswordResponse> {
  return request('POST', '/auth/set-password', { body })
}

/** Renovar tokens con refresh token */
export function refreshToken(body: T.RefreshTokenRequest): Promise<T.TokenResponse> {
  return request('POST', '/auth/refresh', { body })
}

/** Cerrar sesión */
export function logout(body: T.LogoutRequest): Promise<void> {
  return request('POST', '/auth/logout', { body })
}

/** Autenticar o vincular con Google */
export function googleAuth(body: T.GoogleAuthRequest): Promise<T.GoogleAuthResponse> {
  return request('POST', '/auth/google', { body })
}

/** Solicitar enlace de recuperación de contraseña */
export function forgotPassword(body: T.ForgotPasswordRequest): Promise<T.MessageResponse> {
  return request('POST', '/auth/forgot-password', { body })
}

/** Restablecer contraseña con token de recuperación */
export function resetPassword(body: T.ResetPasswordRequest): Promise<T.MessageResponse> {
  return request('POST', '/auth/reset-password', { body })
}

/** Reenviar OTP de verificación */
export function resendOtp(body: T.ResendOtpRequest): Promise<T.MessageResponse> {
  return request('POST', '/auth/resend-otp', { body })
}

/** Listar solicitudes de aprobación de cuentas externas */
export function listApprovalRequests(query?: { page?: string; pageSize?: string; status?: string }): Promise<T.PaginatedApprovalRequests> {
  return request('GET', '/accounts/approval-requests', { query })
}

/** Aprobar cuenta externa */
export function approveAccount(requestId: string): Promise<T.MessageResponse> {
  return request('POST', `/accounts/approval-requests/${requestId}/approve`)
}

/** Rechazar cuenta externa */
export function rejectAccount(requestId: string, body: T.RejectAccountRequest): Promise<T.MessageResponse> {
  return request('POST', `/accounts/approval-requests/${requestId}/reject`, { body })
}

/** Listar solicitudes de concesión de ADMIN */
export function listAdminGrants(query?: { page?: string; pageSize?: string; status?: string }): Promise<T.PaginatedAdminGrantRequests> {
  return request('GET', '/admin-grants', { query })
}

/** Crear solicitud para nuevo ADMIN */
export function createAdminGrant(body: T.CreateAdminGrantRequest): Promise<T.AdminGrantRequestResponse> {
  return request('POST', '/admin-grants', { body })
}

/** Aprobar solicitud de ADMIN */
export function approveAdminGrant(grantId: string): Promise<T.AdminGrantRequestResponse> {
  return request('POST', `/admin-grants/${grantId}/approve`)
}

/** Rechazar solicitud de ADMIN */
export function rejectAdminGrant(grantId: string, body: T.RejectAdminGrantRequest): Promise<T.AdminGrantRequestResponse> {
  return request('POST', `/admin-grants/${grantId}/reject`, { body })
}

/** Listar asignaciones de roles */
export function listRoleAssignments(query?: { page?: string; pageSize?: string; role?: string; scope?: string; userId?: string; active?: string }): Promise<T.PaginatedRoleAssignments> {
  return request('GET', '/role-assignments', { query })
}

/** Asignar un rol contextual */
export function createRoleAssignment(body: T.CreateRoleAssignmentRequest): Promise<T.RoleAssignmentResponse> {
  return request('POST', '/role-assignments', { body })
}

/** Consultar una asignación de rol */
export function getRoleAssignment(assignmentId: string): Promise<T.RoleAssignmentResponse> {
  return request('GET', `/role-assignments/${assignmentId}`)
}

/** Revocar una asignación de rol */
export function revokeRoleAssignment(assignmentId: string): Promise<T.RoleAssignmentResponse> {
  return request('POST', `/role-assignments/${assignmentId}/revoke`)
}

/** Consultar perfil propio */
export function getMyProfile(): Promise<T.ProfileResponse> {
  return request('GET', '/profile')
}

/** Actualizar perfil propio */
export function updateMyProfile(body: T.UpdateProfileRequest): Promise<T.ProfileResponse> {
  return request('PATCH', '/profile', { body })
}

/** Solicitar cambio de correo de acceso */
export function requestEmailChange(body: T.ChangeEmailRequest): Promise<T.MessageResponse> {
  return request('POST', '/profile/change-email', { body })
}

/** Verificar OTP del cambio de correo */
export function verifyEmailChange(body: T.VerifyEmailChangeRequest): Promise<T.MessageResponse> {
  return request('POST', '/profile/verify-email-change', { body })
}

/** Establecer o cambiar correo institucional */
export function setInstitutionalEmail(body: T.SetInstitutionalEmailRequest): Promise<T.MessageResponse> {
  return request('POST', '/profile/set-institutional-email', { body })
}

/** Verificar OTP del correo institucional */
export function verifyInstitutionalEmail(body: T.VerifyInstitutionalEmailRequest): Promise<T.MessageResponse> {
  return request('POST', '/profile/verify-institutional-email', { body })
}

/** Listar usuarios */
export function listUsers(query?: { page?: string; pageSize?: string; status?: string; search?: string }): Promise<T.PaginatedUsers> {
  return request('GET', '/users', { query })
}

/** Consultar detalle de un usuario */
export function getUser(userId: string): Promise<T.UserDetailResponse> {
  return request('GET', `/users/${userId}`)
}

/** Suspender cuenta de usuario */
export function suspendUser(userId: string, body: T.SuspendUserRequest): Promise<T.MessageResponse> {
  return request('POST', `/users/${userId}/suspend`, { body })
}

/** Reactivar cuenta suspendida */
export function reactivateUser(userId: string): Promise<T.MessageResponse> {
  return request('POST', `/users/${userId}/reactivate`)
}

/** Verificar manualmente una cuenta */
export function verifyUser(userId: string): Promise<T.MessageResponse> {
  return request('POST', `/users/${userId}/verify`)
}

/** Reemplazar el correo de acceso de una cuenta */
export function changeUserEmail(userId: string, body: T.ChangeUserEmailRequest): Promise<T.MessageResponse> {
  return request('POST', `/users/${userId}/change-email`, { body })
}

/** Consultar eventos de auditoría */
export function listAuditEvents(query?: { page?: string; pageSize?: string; entityType?: string; entityId?: string; actorId?: string; from?: string; to?: string }): Promise<T.PaginatedAuditEvents> {
  return request('GET', '/audit-events', { query })
}

/** Listar periodos académicos */
export function listAcademicPeriods(query?: { page?: string; pageSize?: string }): Promise<T.PaginatedAcademicPeriods> {
  return request('GET', '/academic-periods', { query })
}

/** Reservado (no disponible en M2): Crear periodo académico */
export function createAcademicPeriod(body: T.CreateAcademicPeriodRequest): Promise<T.AcademicPeriodResponse> {
  return request('POST', '/academic-periods', { body })
}

/** Reservado (no disponible en M2): Consultar periodo académico */
export function getAcademicPeriod(periodId: string): Promise<T.AcademicPeriodResponse> {
  return request('GET', `/academic-periods/${periodId}`)
}

/** Reservado (no disponible en M2): Actualizar periodo académico */
export function updateAcademicPeriod(periodId: string, body: T.UpdateAcademicPeriodRequest): Promise<T.AcademicPeriodResponse> {
  return request('PUT', `/academic-periods/${periodId}`, { body })
}

/** Reservado (no disponible en M2): Eliminar periodo académico */
export function deleteAcademicPeriod(periodId: string): Promise<void> {
  return request('DELETE', `/academic-periods/${periodId}`)
}

/** Listar programas */
export function listPrograms(query?: { page?: string; pageSize?: string; status?: string; periodId?: string; includeArchived?: string }): Promise<T.PaginatedPrograms> {
  return request('GET', '/programs', { query })
}

/** Crear programa */
export function createProgram(body: T.CreateProgramRequest): Promise<T.ProgramResponse> {
  return request('POST', '/programs', { body })
}

/** Consultar programa */
export function getProgram(programId: string): Promise<T.ProgramResponse> {
  return request('GET', `/programs/${programId}`)
}

/** Actualizar programa */
export function updateProgram(programId: string, body: T.UpdateProgramRequest): Promise<T.ProgramResponse> {
  return request('PATCH', `/programs/${programId}`, { body })
}

/** Activar programa */
export function activateProgram(programId: string): Promise<T.ProgramResponse> {
  return request('POST', `/programs/${programId}/activate`)
}

/** Desactivar programa */
export function deactivateProgram(programId: string): Promise<T.ProgramResponse> {
  return request('POST', `/programs/${programId}/deactivate`)
}

/** Archivar programa */
export function archiveProgram(programId: string, body: {
  reason: string
}): Promise<T.MessageResponse> {
  return request('POST', `/programs/${programId}/archive`, { body })
}

/** Listar periodos vinculados a un programa */
export function listProgramPeriods(programId: string): Promise<Array<T.ProgramPeriodResponse>> {
  return request('GET', `/programs/${programId}/periods`)
}

/** Reservado (no disponible en M2): Vincular un periodo a un programa */
export function addProgramPeriod(programId: string, body: T.AddProgramPeriodRequest): Promise<T.ProgramPeriodResponse> {
  return request('POST', `/programs/${programId}/periods`, { body })
}

/** Reservado (no disponible en M2): Desvincular un periodo de un programa */
export function removeProgramPeriod(programId: string, programPeriodId: string): Promise<void> {
  return request('DELETE', `/programs/${programId}/periods/${programPeriodId}`)
}

/** Equipo de líderes del programa */
export function getProgramTeam(programId: string): Promise<Array<T.ProgramTeamMember>> {
  return request('GET', `/programs/${programId}/team`)
}

/** Listar actividades */
export function listActivities(query?: { page?: string; pageSize?: string; programId?: string; periodId?: string; status?: string; independent?: string; groupLabel?: string; fromDate?: string; toDate?: string }): Promise<T.PaginatedActivities> {
  return request('GET', '/activities', { query })
}

/** Crear actividad */
export function createActivity(body: T.CreateActivityRequest): Promise<T.ActivityResponse> {
  return request('POST', '/activities', { body })
}

/** Consultar actividad */
export function getActivity(activityId: string): Promise<T.ActivityResponse> {
  return request('GET', `/activities/${activityId}`)
}

/** Actualizar actividad */
export function updateActivity(activityId: string, body: T.UpdateActivityRequest): Promise<T.ActivityResponse> {
  return request('PATCH', `/activities/${activityId}`, { body })
}

/** Publicar actividad */
export function publishActivity(activityId: string): Promise<T.ActivityResponse> {
  return request('POST', `/activities/${activityId}/publish`)
}

/** Finalizar actividad */
export function finishActivity(activityId: string): Promise<T.ActivityResponse> {
  return request('POST', `/activities/${activityId}/finish`)
}

/** Cancelar actividad */
export function cancelActivity(activityId: string, body: T.CancelActivityRequest): Promise<T.ActivityResponse> {
  return request('POST', `/activities/${activityId}/cancel`, { body })
}

/** Descartar borrador de actividad */
export function discardActivity(activityId: string): Promise<void> {
  return request('DELETE', `/activities/${activityId}/discard`)
}

/** Listar reprogramaciones de una actividad */
export function listActivityReschedules(activityId: string): Promise<Array<T.ActivityRescheduleResponse>> {
  return request('GET', `/activities/${activityId}/reschedules`)
}

/** Reprogramar actividad */
export function rescheduleActivity(activityId: string, body: T.RescheduleActivityRequest): Promise<T.RescheduleActivityResponse> {
  return request('POST', `/activities/${activityId}/reschedules`, { body })
}

/** Cambiar el programa de una actividad o volverla libre */
export function moveActivity(activityId: string, body: T.MoveActivityRequest): Promise<T.ActivityResponse> {
  return request('POST', `/activities/${activityId}/move`, { body })
}

/** Verificar conflictos de horario */
export function checkActivityConflicts(body: T.CheckConflictsRequest): Promise<T.CheckConflictsResponse> {
  return request('POST', '/activities/check-conflicts', { body })
}

/** Catálogo público de programas activos */
export function listCatalogPrograms(query?: { page?: string; pageSize?: string; periodId?: string }): Promise<T.PaginatedCatalogPrograms> {
  return request('GET', '/catalog/programs', { query })
}

/** Periodos académicos para los filtros del catálogo */
export function listCatalogPeriods(): Promise<Array<T.AcademicPeriodResponse>> {
  return request('GET', '/catalog/periods')
}

/** Catálogo público de actividades */
export function listCatalogActivities(query?: { page?: string; pageSize?: string; periodId?: string; programId?: string; status?: string; fromDate?: string; toDate?: string; independent?: string; groupLabel?: string }): Promise<T.PaginatedCatalogActivities> {
  return request('GET', '/catalog/activities', { query })
}

