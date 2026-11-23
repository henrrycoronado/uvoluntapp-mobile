/* eslint-disable */
/* prettier-ignore */
/* Auto-generated from contracts/openapi.yaml — DO NOT EDIT */

/** RFC 9457 Problem Details */
export interface ProblemDetails {
  /** URI que identifica el tipo de problema */
  type: string
  /** Resumen legible del problema */
  title: string
  /** Código HTTP */
  status: number
  /** Explicación específica de esta ocurrencia */
  detail?: string
  /** URI de la ocurrencia */
  instance?: string
  /** Errores de validación por campo (opcional) */
  errors?: Record<string, Array<string>>
}

export interface PaginationMeta {
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export interface MessageResponse {
  message: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  /** Teléfono de contacto; se guarda en el perfil */
  phone?: string
}

export interface RegisterResponse {
  /** Mensaje genérico no revelador */
  message: string
  requiresOtp: boolean
}

export interface VerifyOtpRequest {
  email: string
  /** OTP de 6 dígitos */
  code: string
}

export interface VerifyOtpResponse {
  /** Estado resultante de la cuenta */
  accountStatus: "ACTIVE" | "PENDING_APPROVAL"
  /** Si true, el cliente debe llamar a /auth/complete-registration */
  requiresApprovalData: boolean
  tokens?: TokenPair
}

/** Datos adicionales para cuentas externas en PENDING_APPROVAL */
export interface CompleteRegistrationRequest {
  email: string
  firstName: string
  lastName: string
  phone: string
  /** Relación con la Pastoral Universitaria */
  relationWithPastoral: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface TokenResponse {
  /** JWT de acceso */
  accessToken: string
  /** Refresh token (opaco) */
  refreshToken: string
  /** Expiración del access token (UTC) */
  expiresAt: string
}

/** Par de tokens, presente solo cuando la cuenta es ACTIVE */
export interface TokenPair {
  accessToken: string
  refreshToken: string
  expiresAt: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface LogoutRequest {
  refreshToken: string
}

export interface GoogleAuthRequest {
  /** Token ID de Google */
  idToken: string
}

export interface GoogleAuthResponse {
  accountStatus: "ACTIVE" | "PENDING_APPROVAL"
  isNewAccount: boolean
  tokens?: TokenPair
  email: string
  /** Si true, el cliente debe llamar a /auth/complete-registration */
  requiresApprovalData: boolean
  /** Nombre de Google; solo cuando requiresApprovalData es true */
  firstName?: string
  /** Apellido de Google; solo cuando requiresApprovalData es true */
  lastName?: string
}

export interface ReapplyRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  relationWithPastoral: string
}

export interface SetPasswordRequest {
  email: string
  code: string
  password: string
}

export interface SetPasswordResponse {
  accountStatus: "ACTIVE" | "PENDING_APPROVAL"
  tokens?: TokenResponse
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  /** Token de un solo uso del enlace de recuperación */
  token: string
  newPassword: string
}

export interface ResendOtpRequest {
  email: string
}

export interface ApprovalRequestSummary {
  id: string
  userId: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  relationWithPastoral?: string
  status: "PENDING_APPROVAL" | "ACTIVE" | "REJECTED"
  rejectionReason?: string
  reviewedBy?: string
  createdAt: string
  reviewedAt?: string
}

export interface PaginatedApprovalRequests {
  items: Array<ApprovalRequestSummary>
  meta: PaginationMeta
}

export interface RejectAccountRequest {
  reason: string
}

export interface CreateAdminGrantRequest {
  /** ID del usuario que recibirá el rol ADMIN */
  beneficiaryId: string
}

export interface AdminGrantRequestResponse {
  id: string
  beneficiaryId: string
  requestedBy: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  approvals: Array<AdminGrantApproval>
  rejectionReason?: string
  createdAt: string
  resolvedAt?: string
}

export interface AdminGrantApproval {
  approverId: string
  approvedAt: string
}

export interface PaginatedAdminGrantRequests {
  items: Array<AdminGrantRequestResponse>
  meta: PaginationMeta
}

export interface RejectAdminGrantRequest {
  reason: string
}

export interface CreateRoleAssignmentRequest {
  userId: string
  /** ADMIN se asigna vía admin-grants */
  role: "PROGRAM_LEADER" | "OPERATIONAL_LEADER"
  scope: "PROGRAM" | "ACTIVITY"
  /** ID del programa o actividad */
  scopeId: string
  validFrom?: string
  validUntil?: string
}

export interface RoleAssignmentResponse {
  id: string
  userId: string
  role: "ADMIN" | "PROGRAM_LEADER" | "OPERATIONAL_LEADER"
  scope: "GLOBAL" | "PROGRAM" | "ACTIVITY"
  /** Nulo solo para ámbito GLOBAL */
  scopeId?: string
  grantedBy: string
  validFrom?: string
  validUntil?: string
  revokedAt?: string
  createdAt: string
}

export interface PaginatedRoleAssignments {
  items: Array<RoleAssignmentResponse>
  meta: PaginationMeta
}

export interface ProfileResponse {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  institutionalEmail?: string
  institutionalEmailVerifiedAt?: string
  accountStatus: "PRE_REGISTERED" | "PENDING_VERIFICATION" | "PENDING_APPROVAL" | "ACTIVE" | "REJECTED" | "SUSPENDED"
  roles: Array<RoleAssignmentResponse>
  createdAt: string
  /** Cuenta verificada (correo institucional o ADMIN); null si falta verificación manual */
  verifiedAt?: string
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  phone?: string
}

export interface ChangeEmailRequest {
  newEmail: string
  /** Contraseña actual para confirmar */
  password: string
}

export interface VerifyEmailChangeRequest {
  code: string
}

export interface SetInstitutionalEmailRequest {
  /** Debe terminar en @ucb.edu.bo */
  institutionalEmail: string
}

export interface VerifyInstitutionalEmailRequest {
  code: string
}

export interface UserSummary {
  id: string
  email: string
  firstName: string
  lastName: string
  accountStatus: "PRE_REGISTERED" | "PENDING_VERIFICATION" | "PENDING_APPROVAL" | "ACTIVE" | "REJECTED" | "SUSPENDED"
  createdAt: string
  /** Cuenta verificada (correo institucional o ADMIN); null si falta verificación manual */
  verifiedAt?: string
}

export interface PaginatedUsers {
  items: Array<UserSummary>
  meta: PaginationMeta
}

export interface UserDetailResponse {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  institutionalEmail?: string
  institutionalEmailVerifiedAt?: string
  accountStatus: "PRE_REGISTERED" | "PENDING_VERIFICATION" | "PENDING_APPROVAL" | "ACTIVE" | "REJECTED" | "SUSPENDED"
  roles: Array<RoleAssignmentResponse>
  createdAt: string
  suspendedAt?: string
  /** Cuenta verificada (correo institucional o ADMIN); null si falta verificación manual */
  verifiedAt?: string
}

export interface ChangeUserEmailRequest {
  newEmail: string
  reason: string
}

export interface SuspendUserRequest {
  reason: string
}

export interface AuditEventResponse {
  id: string
  /** Nulo si la acción es del sistema */
  actorId?: string
  actorType: "USER" | "SYSTEM"
  action: string
  entityType: string
  entityId: string
  details?: Record<string, unknown>
  createdAt: string
}

export interface PaginatedAuditEvents {
  items: Array<AuditEventResponse>
  meta: PaginationMeta
}

export interface CreateAcademicPeriodRequest {
  /** Etiqueta tipo '2026-1' */
  label: string
  startDate: string
  endDate: string
}

export interface UpdateAcademicPeriodRequest {
  label: string
  startDate: string
  endDate: string
}

export interface AcademicPeriodResponse {
  id: string
  label: string
  startDate: string
  endDate: string
  createdAt: string
}

export interface PaginatedAcademicPeriods {
  items: Array<AcademicPeriodResponse>
  meta: PaginationMeta
}

export interface CreateProgramRequest {
  name: string
  description?: string
  contact?: string
  referenceSchedule?: string
}

export interface UpdateProgramRequest {
  name?: string
  description?: string
  contact?: string
  referenceSchedule?: string
}

export interface ProgramResponse {
  id: string
  name: string
  description?: string
  status: "DRAFT" | "ACTIVE" | "INACTIVE"
  createdAt: string
  updatedAt?: string
  contact?: string
  referenceSchedule?: string
  archivedAt?: string
  /** El actor puede gestionar este programa (ADMIN o líder asignado) */
  canManage?: boolean
}

export interface PaginatedPrograms {
  items: Array<ProgramResponse>
  meta: PaginationMeta
}

export interface AddProgramPeriodRequest {
  periodId: string
}

export interface ProgramPeriodResponse {
  id: string
  programId: string
  periodId: string
  period: AcademicPeriodResponse
  createdAt: string
}

export interface CreateActivityRequest {
  /** Nulo para actividad independiente */
  programId?: string
  /** Obligatorio; si tiene programa, debe estar vinculado */
  periodId: string
  title: string
  description?: string
  modality: "IN_PERSON" | "VIRTUAL" | "HYBRID"
  location?: string
  startsAt: string
  /** Debe ser posterior a startsAt */
  endsAt: string
  /** Nulo = sin límite */
  capacity?: number
  /** Nota orientativa de periodicidad (no genera ocurrencias) */
  periodicityNote?: string
  /** Obligatorio para publicar si la modalidad es VIRTUAL o HYBRID */
  meetingUrl?: string
  /** Requiere registro previo. Sin registro previo no hay cupo. */
  requiresRegistration?: boolean
  /** Horas previstas, solo informativas */
  expectedHours?: number
  participationConditions?: string
  /** Etiqueta para agrupar actividades libres */
  groupLabel?: string
}

/** Tras publicar: solo description, location y capacity (hacia arriba) son editables.
Horario solo por reprogramación. Programa fijo.
 */
export interface UpdateActivityRequest {
  title?: string
  description?: string
  modality?: "IN_PERSON" | "VIRTUAL" | "HYBRID"
  location?: string
  capacity?: number
  periodicityNote?: string
  /** Obligatorio para publicar si la modalidad es VIRTUAL o HYBRID */
  meetingUrl?: string
  /** Requiere registro previo. Sin registro previo no hay cupo. */
  requiresRegistration?: boolean
  /** Horas previstas, solo informativas */
  expectedHours?: number
  participationConditions?: string
  /** Etiqueta para agrupar actividades libres */
  groupLabel?: string
  /** Solo en DRAFT; publicada se reprograma */
  startsAt?: string
  endsAt?: string
}

export interface ActivityResponse {
  id: string
  programId?: string
  periodId: string
  title: string
  description?: string
  modality: "IN_PERSON" | "VIRTUAL" | "HYBRID"
  location?: string
  startsAt: string
  endsAt: string
  capacity?: number
  periodicityNote?: string
  status: "DRAFT" | "PUBLISHED" | "IN_PROGRESS" | "FINISHED" | "CANCELLED"
  cancellationReason?: string
  /** Momento en que pasó a IN_PROGRESS */
  startedAt?: string
  finishedAt?: string
  createdAt: string
  updatedAt?: string
  /** Obligatorio para publicar si la modalidad es VIRTUAL o HYBRID */
  meetingUrl?: string
  /** Requiere registro previo. Sin registro previo no hay cupo. */
  requiresRegistration?: boolean
  /** Horas previstas, solo informativas */
  expectedHours?: number
  participationConditions?: string
  /** Etiqueta para agrupar actividades libres */
  groupLabel?: string
  programName?: string
  canManage?: boolean
  /** Solo ADMIN (SCRUM-123) */
  canMove?: boolean
}

export interface PaginatedActivities {
  items: Array<ActivityResponse>
  meta: PaginationMeta
}

export interface CancelActivityRequest {
  reason: string
}

export interface RescheduleActivityRequest {
  reason: string
  newStartsAt: string
  /** Debe ser posterior a newStartsAt */
  newEndsAt: string
}

export interface RescheduleActivityResponse {
  activity: ActivityResponse
  reschedule: ActivityRescheduleResponse
  /** Advertencias de solapamiento (no bloquean) */
  conflicts: Array<ConflictWarning>
}

export interface ActivityRescheduleResponse {
  id: string
  activityId: string
  reason: string
  previousStartsAt: string
  previousEndsAt: string
  newStartsAt: string
  newEndsAt: string
  rescheduledBy: string
  createdAt: string
}

export interface MoveActivityRequest {
  /** Programa destino; vacío convierte la actividad en libre */
  programId?: string
  reason: string
}

export interface ProgramTeamMember {
  assignmentId: string
  userId: string
  fullName: string
  email?: string
  role: "PROGRAM_LEADER" | "OPERATIONAL_LEADER"
  scope: "PROGRAM" | "ACTIVITY"
  scopeId: string
  activityTitle?: string
  validFrom?: string
  validUntil?: string
  grantedBy?: string
}

export interface CheckConflictsRequest {
  /** ID de la actividad existente (nulo al crear) */
  activityId?: string
  startsAt: string
  endsAt: string
  location?: string
  /** Programa de una actividad nueva (define sus responsables) */
  programId?: string
}

export interface CheckConflictsResponse {
  hasConflicts: boolean
  conflicts: Array<ConflictWarning>
}

export interface ConflictWarning {
  type: "LEADER_OVERLAP" | "LOCATION_OVERLAP"
  conflictingActivityId: string
  conflictingActivityTitle: string
  message: string
}

export interface CatalogProgramSummary {
  id: string
  name: string
  description?: string
  contact?: string
  referenceSchedule?: string
}

export interface PaginatedCatalogPrograms {
  items: Array<CatalogProgramSummary>
  meta: PaginationMeta
}

export interface CatalogActivitySummary {
  id: string
  title: string
  description?: string
  programId?: string
  programName?: string
  modality: "IN_PERSON" | "VIRTUAL" | "HYBRID"
  location?: string
  startsAt: string
  endsAt: string
  capacity?: number
  status: "PUBLISHED" | "IN_PROGRESS"
  periodicityNote?: string
  periodId?: string
  groupLabel?: string
  requiresRegistration?: boolean
  expectedHours?: number
  participationConditions?: string
}

export interface PaginatedCatalogActivities {
  items: Array<CatalogActivitySummary>
  meta: PaginationMeta
}

