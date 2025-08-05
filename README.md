# Travel Frontend

A **Vue 3** single-page application built with **Vite**, **TypeScript**, **Pinia**, and **DaisyUI** for managing and viewing travel routes.

## 🔍 Описание

Этот проект — клиентская часть «Travel» приложения:
- Отображение списка маршрутов и деталей каждого маршрута  
- Админ-панель для создания и редактирования маршрутов  
- Загрузка фотографий для точек маршрута  
- Редактор текста на базе TipTap
- Интерактивная карта с Leaflet  

## ⚙️ Технологии

- **Vue 3** с `<script setup>` и **Composition API**  
- **TypeScript**  
- **Vite**  
- **Pinia** (хранилища: `alert`, `routes`)  
- **TailwindCSS** + **DaisyUI** + `@tailwindcss/cli` + **PostCSS**  
- **Element Plus** + **@element-plus/icons-vue**  
- **TipTap** с **Codemirror** для rich-text  
- **Leaflet** для карт  

## 🛠 Установка и запуск

### Предварительные требования

- Node.js >= 18  
- npm или yarn  

### Установка зависимостей

```bash
git clone <repo-url>
cd travel-frontend
npm install
