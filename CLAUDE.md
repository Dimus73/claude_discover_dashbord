# Monitor Dashboard

Real-time server monitoring dashboard: Express backend collects OS metrics, React frontend polls and renders them.

## Architecture

```
/
├── server/          Node.js + Express API
│   └── src/
│       └── index.js   единственный файл сервера
└── client/          React (create-react-app)
    └── src/
        ├── App.js
        └── components/
            ├── Dashboard.js   главная страница, polling, state
            ├── MetricCard.js  карточка одной метрики
            └── CpuChart.js    график истории CPU (recharts)
```

Нет общего package.json в корне — у сервера и клиента отдельные зависимости.

## Запуск

Два терминала:

```bash
# Терминал 1 — сервер (порт 3001)
cd server && npm run dev      # с hot-reload через nodemon
# или
cd server && npm start        # без hot-reload

# Терминал 2 — клиент (порт 3000)
cd client && npm start
```

После запуска: http://localhost:3000

## API endpoints

| Метод | Путь                  | Описание                              |
|-------|-----------------------|---------------------------------------|
| GET   | /api/health           | Статус сервера, timestamp, uptime     |
| GET   | /api/metrics          | Текущие метрики (cpu, memory, uptime, requests) |
| GET   | /api/metrics/history  | Последние 20 снэпшотов метрик         |

Формат `/api/metrics`:
```json
{ "time": "14:23:01", "cpu": 31.5, "memory": 24488, "uptime": 42, "requests": 0 }
```

`cpu` — процент от load average / число ядер, 0–100.  
`memory` — использованная RAM в МБ.  
`requests` — кол-во запросов за последнюю завершённую минуту (req/min).

## Проверка

```bash
# Убедиться, что сервер живёт
curl http://localhost:3001/api/health

# Посмотреть метрики
curl http://localhost:3001/api/metrics

# Посмотреть историю (появляется через ~3 сек после запуска)
curl http://localhost:3001/api/metrics/history

# Проверить production-сборку клиента (должна завершиться без ошибок)
cd client && CI=true npm run build
```

## Соглашения по коду

**Сервер**
- Весь код живёт в `server/src/index.js`. Новые модули выносятся в `server/src/`.
- Стандартный CommonJS (`require`/`module.exports`), без TypeScript.
- Константы вверху файла заглавными буквами (`HISTORY_LIMIT`, `PORT`).

**Клиент**
- Функциональные компоненты с хуками, без классов.
- Стили — inline JS-объект `const styles = { ... }` в конце файла. CSS-файлов нет.
- `value == null` для проверки загрузки (покрывает и `undefined`, и `null`).
- Состояние и polling сосредоточены в `Dashboard.js`; дочерние компоненты — чистые (только props).
- Именование: `PascalCase` для компонентов и файлов компонентов.

**Оба**
- Комментарии только там, где поведение неочевидно.
- Нет TypeScript, нет тестов — проект учебный.

## Что важно не сломать

**Порты.** Сервер строго на `3001`, клиент на `3000`. `BASE_URL` захардкожен в `Dashboard.js` — если поменять порт сервера, нужно обновить его там же.

**CORS.** Сервер использует `cors()` без ограничений — это нужно для работы клиента с `localhost:3000`. Не удалять middleware и не добавлять whitelist без обновления клиентского origin.

**Polling interval.** `POLL_INTERVAL = 3000` в `Dashboard.js` и `setInterval(..., 3_000)` в `index.js` намеренно совпадают — история накапливается синхронно с тем, что видит клиент. Если менять интервал, менять в обоих местах.

**История метрик.** `metricsHistory` живёт в памяти процесса. При рестарте сервера история сбрасывается — это нормальное поведение, не баг.

**Счётчик запросов.** `requestsPerMin` сбрасывается раз в 60 сек. В первую минуту после старта всегда показывает `0` — это ожидаемо.

**Анимация recharts.** `isAnimationActive={false}` в `CpuChart` — намеренно, иначе график мерцает при каждом обновлении каждые 3 сек.

## Частые ошибки

**`Error: listen EADDRINUSE :::3001`**  
Старый процесс сервера не завершился (например, после Ctrl+C в nodemon). Убить:
```bash
lsof -ti :3001 | xargs kill -9
```

---

**`Cannot GET /api/metrics` — сервер отвечает HTML-страницей ошибки**  
Чаще всего запрос ушёл на порт 3000 (клиент) вместо 3001. Проверить `BASE_URL` в `Dashboard.js` и адрес в curl.

---

**`Module not found: Error: Can't resolve 'recharts'`**  
recharts не установлен. Зависимости клиента ставятся отдельно:
```bash
cd client && npm install
```
Не запускать `npm install` из корня — там нет `package.json`.

---

**График CPU пустой сразу после запуска сервера**  
Нормальное поведение: первый снэпшот в `metricsHistory` появляется через 3 секунды после старта (первый тик `setInterval`). Подождать несколько секунд.

---

**Карточки показывают `...` и не обновляются**  
Сервер не запущен или недоступен. Проверить:
```bash
curl http://localhost:3001/api/health
```
Если нет ответа — запустить сервер. В браузере ошибка будет видна в `Network` DevTools.

---

**`cpu` показывает 100% сразу после запуска системы**  
`os.loadavg()` на macOS отдаёт корректные данные только спустя ~1 минуту после старта ОС. Это ограничение ОС, не баг кода.
