import { ApiResponseDto } from '../shared/dtos/index.js';
import type { Request } from '../shared/types/request.js';
import { ConversationsService, type ChatDetail, type ChatListItem, type CreatedConversation, type MessagesPage, type RandomConversation } from './conversations.service.js';
import type { MessageItemView } from '../shared/events/message.events.js';
import { CreateConversationDto } from './dto/create-conversation.dto.js';
import { CreateMessageDto } from './dto/create-message.dto.js';
import { GetMessagesQuery } from './dto/get-messages.query.js';
import { SetAnonymityDto } from './dto/set-anonymity.dto.js';
export declare class ConversationsController {
    private readonly conversationsService;
    constructor(conversationsService: ConversationsService);
    list(req: Request): Promise<ApiResponseDto<ChatListItem[]>>;
    create(req: Request, dto: CreateConversationDto): Promise<ApiResponseDto<CreatedConversation>>;
    random(req: Request): Promise<ApiResponseDto<RandomConversation>>;
    detail(req: Request, id: string): Promise<ApiResponseDto<ChatDetail>>;
    setAnonymity(req: Request, id: string, dto: SetAnonymityDto): Promise<ApiResponseDto<ChatDetail>>;
    remove(req: Request, id: string): Promise<ApiResponseDto<{
        deleted: true;
    }>>;
    messages(req: Request, id: string, query: GetMessagesQuery): Promise<ApiResponseDto<MessagesPage>>;
    sendMessage(req: Request, id: string, dto: CreateMessageDto): Promise<ApiResponseDto<MessageItemView>>;
    read(req: Request, id: string): Promise<ApiResponseDto<{
        readAt: Date | null;
    }>>;
}
