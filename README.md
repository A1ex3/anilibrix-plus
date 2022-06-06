# AniLibrix

Анилибрия — так звучит аниме!
Десктопный кинотеатр Анилибрии.

![Anilibrix](https://raw.githubusercontent.com/pavloniym/anilibrix/.github/assets/anilibrix.png)

### Особенности:

* Кроссплатформенное приложение: Mac, Windows, Linux
* Сохранение просмотренных эпизодов, возможность в ручную пометить эпизоды как просмотренные/снять пометку  о просмотре
* Список последних релизов с автоматическим обновлением в фоне
* Возможность воспроизоводить торренты прямо в приложении, онлайн, без предварительной загрузки
* Уведомления о новых релизах -- теперь вы не пропустите свои любимые релизы
* Автовоспроизведение эпизодов
* Каталог релизов
* Поиск релизов по названию
* Авторизация на сайте Анилибрии
* Синхронизация избранного


### Сборка и запуск

> Требуемая верси Node.JS - **14.18.0**
> На других версиях (особенно выше) могут быть проблемы с сборкой нативных модулей

Перед запуском не забудьте скопировать и отредактировать пример `.env` файла:

``` bash
cp .env.example .env
```

``` bash
# Установка и сборка зависимостей
yarn install

# Запуск с горячей перезагрузкой на localhost:9080
yarn run serve

# Сборка production версии
yarn run build

# Запуск ESLint --fix для JS/Vue файлов и компонентов в `src/`
yarn run lint:fix

# Сборка под все платформы
yarn run release

# Сборка под MacOS
yarn run release:mac

# Сборка под Windows
yarn run release:win

# Сборка под Linux
yarn run release:lin
```
