| Método | Ruta | Sesión | Límite |
|---|---|---|---|
| POST | `/auth/register` | Opcional / pública | 3/h |
| POST | `/auth/login` | Opcional / pública | 5 fallos/15 min |
| PUT | `/user/updatePassword/{uid}` | JWT | 20/min por usuario; archivos 10/h |
| PUT | `/user/updateUser/{uid}` | JWT | 20/min por usuario; archivos 10/h |
| PATCH | `/user/updateProfilePicture/{uid}` | JWT | 20/min por usuario; archivos 10/h |
| DELETE | `/user/deleteUser/{uid}` | JWT | 20/min por usuario; archivos 10/h |
| GET | `/user/getUser/{uid}` | Opcional / pública | global 600/min |
| GET | `/user/getUsers` | ADMIN | global 600/min |
| GET | `/publication/getPublications` | Opcional / pública | global 600/min |
| GET | `/publication/getPublication/{pid}` | Opcional / pública | global 600/min |
| GET | `/publication/user/{userId}` | JWT | global 600/min |
| POST | `/publication/addPublication` | JWT | 20/min por usuario; archivos 10/h |
| PUT | `/publication/updatePublication/{pid}` | JWT | 20/min por usuario; archivos 10/h |
| DELETE | `/publication/deletePublication/{pid}` | JWT | 20/min por usuario; archivos 10/h |
| GET | `/comment/getComments` | ADMIN | global 600/min |
| GET | `/comment/getComment/{cid}` | Opcional / pública | global 600/min |
| GET | `/comment/publication/{pid}` | Opcional / pública | global 600/min |
| POST | `/comment/addComment` | JWT | 20/min por usuario; archivos 10/h |
| DELETE | `/comment/deleteComment/{cid}` | JWT | 20/min por usuario; archivos 10/h |
| POST | `/reactions/addOrUpdateReaction/{pid}` | JWT | 20/min por usuario; archivos 10/h |
| DELETE | `/reactions/removeReaction/{pid}` | JWT | 20/min por usuario; archivos 10/h |
| GET | `/reactions/getPublicationReactions/{pid}` | Opcional / pública | global 600/min |
| GET | `/reactions/getUserReaction/{pid}` | JWT | global 600/min |
| GET | `/hashtag/getHashtags` | Opcional / pública | global 600/min |
| GET | `/hashtag/getHashtag/{hid}` | Opcional / pública | global 600/min |
| GET | `/hashtag/search` | Opcional / pública | global 600/min |
| GET | `/hashtag/publications/{name}` | Opcional / pública | global 600/min |
| POST | `/hashtag/addHashtag` | ADMIN | 20/min por usuario; archivos 10/h |
| DELETE | `/hashtag/deleteHashtag/{hid}` | ADMIN | 20/min por usuario; archivos 10/h |
