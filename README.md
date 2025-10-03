В никах доступны только _ из символов.
Мейлы могут быть максимум с одной точкой
```
test@icloud.com //валидный
test.test@icloud.com //валидный
test.te.st@icloud.com //невалидный
```
Нужно генерировать токен для того чтобы можно было работать с мейлом.
Формат users.yml 
```
users:
  - username: test
    email: test@icloud.com
```

Формат tokens.txt 
```
username=TOKEN
```
После успешной регистрации будет удален аккаунт с users.yml и будет добавлен user в tokens.txt

Старт `npm run dev` в дебаге и `npm run prod` в продакшене.
