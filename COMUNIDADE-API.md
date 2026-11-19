# Contrato de API da comunidade V34

A API é uma proposta de integração. O website estático ainda não disponibiliza sessões, perfis sincronizados, fórum, denúncias ou inscrições beta. YouTube e TikTok continuam disponíveis através das ligações públicas em Contacto.

| Método e rota | Sessão | Resposta prevista |
| --- | --- | --- |
| GET /api/v1/me | Utilizador | Perfil próprio com ID opaco, nome público, avatar, XP, conquistas e preferências |
| PATCH /api/v1/me/profile | Utilizador | Perfil atualizado. Campos aceites: nome público e ID de avatar do catálogo |
| GET /api/v1/topics?cursor=… | Nenhuma | Tópicos públicos com cursor opaco para a página seguinte |
| POST /api/v1/topics | Utilizador | Tópico criado com título e texto, sujeito a moderação |
| POST /api/v1/topics/{id}/comments | Utilizador | Comentário criado com texto, sujeito a moderação |
| PUT /api/v1/me/favorites/{projectId} | Utilizador | Favorito persistido, idempotente |
| DELETE /api/v1/me/favorites/{projectId} | Utilizador | Favorito removido, idempotente |
| POST /api/v1/reports | Utilizador | Denúncia recebida com alvo, motivo e ID de acompanhamento |
| PUT /api/v1/me/beta/{campaignId} | Utilizador | Inscrição persistida apenas para uma campanha com vagas e ativa |
| POST /api/v1/me/exports | Utilizador | Pedido de exportação assíncrona, associado à sessão |
| POST /api/v1/me/deletion | Utilizador, identificação recente | Pedido de eliminação com confirmação explícita e registo do estado |
| GET /api/v1/admin/reports?cursor=… | Moderador com MFA | Fila de denúncias e estado de cada revisão |
| POST /api/v1/admin/reports/{id}/decision | Moderador com MFA | Decisão registada com motivo e auditoria |

O servidor deriva a identidade da sessão e verifica o acesso a cada objeto. Perfis não incluem endereços de email nas respostas públicas. XP e conquistas são atribuídos pelo servidor a partir de eventos deduplicados. Favoritos locais do catálogo ficam no dispositivo até existir uma opção explícita de sincronização.

Antes de ativar a API, selecionar fornecedor de identidade e armazenamento, aplicar validação de dados e limites de frequência, definir regras de retenção e moderação, configurar MFA administrativo e testar autorização entre contas. Se a sessão usar cookies, aplicar cookies seguros e proteção CSRF nas operações que alterem dados. Responder com 401 sem sessão, 403 sem permissão, 422 com dados inválidos e 429 ao atingir limites. Registar ações administrativas sem escrever credenciais, tokens ou conteúdo sensível nos logs.
