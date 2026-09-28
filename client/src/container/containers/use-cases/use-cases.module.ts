import {
  CreateConversationUseCase,
  CreateMessageUseCase,
  DeleteAvatarUseCase,
  DeleteConversationUseCase,
  GetChatMessagesUseCase,
  MarkChatReadUseCase,
  SendChatMessageUseCase,
  StartRandomChatUseCase,
  GetChatDetailUseCase,
  GetConversationsUseCase,
  GetSocketCredentialsUseCase,
  GetDocumentTypesUseCase,
  GetMessagesUseCase,
  HealthCheckUseCase,
  RefreshTokenUseCase,
  SetChatAnonymityUseCase,
  SignInUseCase,
  SignOutUseCase,
  SignUpUseCase,
  UpdateInfoUseCase,
  UploadAvatarUseCase,
  WhoAmIUseCase,
} from "@UseCase";
import { ContainerModule, type ContainerModuleLoadOptions } from "inversify";
import { USE_CASES_TYPES } from "./use-cases.types";

/**
 * Registra los casos de uso (capa de aplicación). Cada uno se resuelve por su
 * token desde `useInjection`. Añade aquí los nuevos casos de uso de anomChat.
 */
export const useCasesModule = new ContainerModule(
  (options: ContainerModuleLoadOptions) => {
    // Salud / diagnóstico
    options.bind(USE_CASES_TYPES._HealthCheck).to(HealthCheckUseCase);

    // Autenticación
    options.bind(USE_CASES_TYPES._SignIn).to(SignInUseCase);
    options.bind(USE_CASES_TYPES._SignUp).to(SignUpUseCase);
    options.bind(USE_CASES_TYPES._SignOut).to(SignOutUseCase);
    options.bind(USE_CASES_TYPES._RefreshToken).to(RefreshTokenUseCase);
    options.bind(USE_CASES_TYPES._WhoAmI).to(WhoAmIUseCase);

    // Tipos de documento
    options.bind(USE_CASES_TYPES._GetDocumentTypes).to(GetDocumentTypesUseCase);

    // Socket
    options
      .bind(USE_CASES_TYPES._GetSocketCredentials)
      .to(GetSocketCredentialsUseCase);

    // Cuenta / perfil
    options.bind(USE_CASES_TYPES._UpdateInfo).to(UpdateInfoUseCase);

    // Avatar (foto de perfil)
    options.bind(USE_CASES_TYPES._UploadAvatar).to(UploadAvatarUseCase);
    options.bind(USE_CASES_TYPES._DeleteAvatar).to(DeleteAvatarUseCase);

    // Conversaciones (chats)
    options.bind(USE_CASES_TYPES._GetConversations).to(GetConversationsUseCase);
    options
      .bind(USE_CASES_TYPES._CreateConversation)
      .to(CreateConversationUseCase);
    options.bind(USE_CASES_TYPES._GetChatDetail).to(GetChatDetailUseCase);
    options
      .bind(USE_CASES_TYPES._SetChatAnonymity)
      .to(SetChatAnonymityUseCase);
    options
      .bind(USE_CASES_TYPES._DeleteConversation)
      .to(DeleteConversationUseCase);
    options.bind(USE_CASES_TYPES._SendChatMessage).to(SendChatMessageUseCase);
    options.bind(USE_CASES_TYPES._GetChatMessages).to(GetChatMessagesUseCase);
    options.bind(USE_CASES_TYPES._MarkChatRead).to(MarkChatReadUseCase);
    options.bind(USE_CASES_TYPES._StartRandomChat).to(StartRandomChatUseCase);

    // Mensajes (dominio de ejemplo)
    options.bind(USE_CASES_TYPES._GetMessages).to(GetMessagesUseCase);
    options.bind(USE_CASES_TYPES._CreateMessage).to(CreateMessageUseCase);
  },
);
