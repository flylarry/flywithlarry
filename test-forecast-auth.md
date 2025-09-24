# Тестування авторизації для Forecast сторінки

## Сценарії тестування:

### 1. Гість користувач (перший раз)

- Відкрити `http://localhost:3000/forecast/AA100`
- **Очікуваний результат:**
  - Запит виконується успішно
  - Віднімається 1 запит з localStorage
  - Показується прогноз турбулентності

### 2. Гість користувач (другий раз)

- Після першого запиту, відкрити `http://localhost:3000/forecast/UA2457`
- **Очікуваний результат:**
  - Показується AuthModal для реєстрації
  - Запит НЕ виконується
  - Лічильник НЕ збільшується

### 3. Авторизований користувач (з токенами)

- Увійти в систему
- Відкрити `http://localhost:3000/forecast/AA100`
- **Очікуваний результат:**
  - Запит виконується успішно
  - Віднімається 3 токени з акаунту
  - Показується прогноз турбулентності

### 4. Авторизований користувач (без токенів)

- Використати всі токени
- Відкрити `http://localhost:3000/forecast/AA100`
- **Очікуваний результат:**
  - Показується повідомлення про необхідність оновлення плану
  - Запит НЕ виконується
  - Токени НЕ віднімаються

### 5. Некоректний формат номера рейсу

- Відкрити `http://localhost:3000/forecast/AA000000000` (занадто довгий)
- **Очікуваний результат:**
  - Показується "Invalid Flight Number" з прикладами
  - Помаранчевий колір (warning)
  - Приклади правильних форматів

### 6. Неіснуючий рейс

- Відкрити `http://localhost:3000/forecast/ZZ999`
- **Очікуваний результат:**
  - Показується "Flight Not Found"
  - Синій колір (info)
  - Кнопка "Check Flight Status" → FlightRadar24

### 7. Клієнтська валідація в формі

- Відкрити `/turbulence`
- Ввести `A1` (занадто коротко)
- **Очікуваний результат:**
  - Показується помилка валідації
  - Форма не надсилається
  - При правильному введенні помилка зникає

## Логування для перевірки:

### В консолі браузера має з'являтися:

```
🔐 Checking authorization for forecast AA100: {user: 'guest', canMakeRequest: true, isHydrated: true}
✅ User authorized for AA100, proceeding with fetch
🚀 Starting forecast fetch for AA100...
✅ Forecast data received for AA100: {loading: false, hasForecast: true, severity: "smooth"}
📊 Incrementing guest turbulence count for AA100...
✅ Guest turbulence count incremented successfully
```

### Для гостя без лімітів:

```
🔐 Checking authorization for forecast AA100: {user: 'guest', canMakeRequest: false, isHydrated: true}
🚫 Guest user limit reached for AA100, showing auth modal
```

### Для авторизованого користувача без токенів:

```
🔐 Checking authorization for forecast AA100: {user: 'authenticated', canMakeRequest: false, isHydrated: true}
🚫 Authenticated user limit reached for AA100
```

## Перевірка localStorage:

### Для гостя:

```javascript
// Перевірити поточний стан
localStorage.getItem("larry_guest_turbulence");

// Очистити для тестування
localStorage.removeItem("larry_guest_turbulence");
```

## API логування:

### В серверних логах має з'являтися:

```
🚀 POST /api/turbulence - Request body: {"flightNumber":"AA100"}
🔑 Cache key: AA100
⚡ Returning basic flight info immediately for AA100
🔍 Getting basic flight info for AA100...
💥 Cache MISS for basic flight info: AA100
🔍 Fetching AeroDataBox data for AA100...
✅ AeroDataBox API call for AA100: 1250ms
```

## Проблеми які були виправлені:

1. ❌ **Було:** Запит виконувався одразу без перевірки авторизації
2. ✅ **Стало:** Спочатку перевіряється авторизація та ліміти

3. ❌ **Було:** Гість міг робити необмежену кількість запитів
4. ✅ **Стало:** Гість має лише 1 безкоштовний запит

5. ❌ **Було:** Немає візуальної індикації лімітів
6. ✅ **Стало:** Показується AuthModal або повідомлення про оновлення

7. ❌ **Було:** Немає логування процесу авторизації
8. ✅ **Стало:** Детальне логування всіх кроків

9. ❌ **Було:** Показувалися нечіткі повідомлення про помилки ("Invalid request data")
10. ✅ **Стало:** Зрозумілі повідомлення з контекстом та порадами

## Нові можливості для обробки помилок:

### Типи помилок та їх обробка:

**1. INVALID_FLIGHT_FORMAT:**

- **Заголовок:** "Invalid Flight Number"
- **Повідомлення:** Пояснення формату + приклади (AA100, DL456, UA2457, BA212)
- **Колір:** Помаранчевий (warning)

**2. FLIGHT_NOT_FOUND:**

- **Заголовок:** "Flight Not Found"
- **Повідомлення:** Пояснення що рейс не знайдено + поради
- **Колір:** Синій (info)
- **Дія:** Кнопка "Check Flight Status" → FlightRadar24

**3. ROUTE_DATA_INCOMPLETE:**

- **Заголовок:** "Route Data Unavailable"
- **Повідомлення:** Пояснення про чартерні рейси чи недоступність даних
- **Колір:** Синій (info)

**4. SERVER_ERROR:**

- **Заголовок:** "Service Temporarily Unavailable"
- **Повідомлення:** Повідомлення про тимчасову недоступність
- **Колір:** Червоний (error)

### Клієнтська валідація:

**Додана валідація в TurbulenceForm:**

- Перевірка довжини (3-10 символів)
- Перевірка формату (2-3 букви + 1-4 цифри)
- Живе очищення помилок при правильному введенні
- Попередження перед надсиланням запиту
