# E-mails — templates para Resend

## Template oficial `password-reset-notification`

O código em **`lib/resend-password-email.ts`** envia primeiro com o template **password-reset-notification** do dashboard Resend (`template.id` + `variables`). Variáveis enviadas:

| Variável | Conteúdo |
|----------|----------|
| `RESET_LINK` | URL absoluta da Minha Conta |
| `ACTION_URL` / `LOGIN_URL` | Mesma URL (aliases) |
| `USER_NAME` | Username do auth |
| `TEMPORARY_PASSWORD` / `PASSWORD` / `NEW_PASSWORD` | Senha temporária |

Se o template publicado na Resend **não** tiver essas chaves, a API pode responder 422 — nesse caso o código faz **fallback** para HTML inline com a senha no corpo.

Para usar só o visual do template e ainda mostrar a senha, **duplique** o template no Resend e inclua no HTML `{{{ TEMPORARY_PASSWORD }}}` (ou o nome que preferir) e defina a variável no template; o payload já envia `TEMPORARY_PASSWORD`.

---

## `resend-recuperar-senha.html`

HTML para colar no **Resend Dashboard → Templates** (recuperação de senha / nova senha área do cliente).

### Variáveis no Resend (todas `string`)

| Chave | Descrição |
|-------|-----------|
| `USERNAME` | Usuário, e-mail ou telefone usado no login |
| `TEMPORARY_PASSWORD` | Senha temporária gerada |
| `LOGIN_URL` | URL absoluta, ex.: `https://seudominio.com/minha-conta` |

No editor da Resend, use **{{{ USERNAME }}}** etc. (três chaves, nome em maiúsculas).

### Depois de publicar o template

O envio passa a usar `template.id` + `variables` na API; o corpo `html` inline deixa de ser enviado nesse fluxo. Para continuar usando o HTML gerado no código (sem template Resend), use `lib/email-templates/recuperar-senha.ts`.
