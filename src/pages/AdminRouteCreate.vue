<template>
  <div class="flex h-full">
    <div class="w-1/2 p-6 space-y-4 overflow-auto">
      <Breadcrumbs />

      <h2 class="text-xl font-semibold mb-2">
        {{ isEdit ? 'Редактировать' : 'Новый' }} маршрут
      </h2>

      <!-- Название -->
      <input
        v-model="store.title"
        placeholder="Название маршрута"
        class="input input-primary w-full mb-4"
      />

      <!-- Обложка -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Обложка маршрута</label>
        <div
          class="relative border-2 border-dashed border-primary rounded-lg p-6 text-center cursor-pointer"
          @click="triggerCoverSelect"
          @dragover.prevent
          @drop.prevent="onCoverDrop"
        >
          <p class="text-gray-500">
            Перетащите сюда или нажмите, чтобы выбрать обложку
          </p>
          <img
            v-if="store.coverImage"
            :src="store.coverImage.previewUrl"
            class="mt-4 mx-auto w-32 h-32 object-cover rounded"
          />
          <button
            v-if="store.coverImage"
            class="absolute top-2 right-2 btn btn-xs btn-circle btn-error"
            @click.stop="store.removeCoverImage"
          >
            ✕
          </button>
          <input
            ref="coverInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onCoverChange"
          />
        </div>
      </div>

      <!-- Описание маршрута -->
      <textarea
        v-model="store.description"
        placeholder="Описание маршрута…"
        class="textarea textarea-primary w-full mb-4"
      ></textarea>

      <!-- Список точек -->
      <fieldset class="fieldset bg-base-200 border rounded p-4">
        <legend class="text-sm">Точки маршрута</legend>
        <draggable
          v-model="store.points"
          item-key="id"
          class="space-y-3 mt-2"
          @end="store.reorderPoints"
        >
          <template #item="{ element: pt, index }">
            <div class="card bg-base-100 shadow-sm">
              <div class="card-body relative px-4 pb-4 pt-6">
                <!-- Удалить точку -->
                <button
                  class="btn btn-square btn-sm absolute right-4 top-4"
                  @click="store.removePoint(index)"
                >
                  ✕
                </button>

                <!-- Координаты -->
                <div class="mb-2">
                  <strong>Точка {{ index + 1 }}:</strong>
                  {{ pt.lat.toFixed(5) }}, {{ pt.lng.toFixed(5) }}
                </div>

                <div class="mb-2">
                  <input
                    type="text"
                    v-model="pt.name"
                    placeholder="Название точки"
                    class="input input-primary w-full mb-4"
                  />
                </div>

                <!-- Описание точки -->
                <RichTextEditor
                  v-model="pt.description"
                  placeholder="Описание точки…"
                />

                <!-- Фото -->
                <div
                  class="mt-3 border-2 border-dashed border-primary rounded p-4 text-center"
                  @click="triggerFileSelect(index)"
                  @dragover.prevent
                  @drop.prevent="onFilesDrop($event, index)"
                >
                  Перетащите фото или нажмите, чтобы выбрать
                  <draggable
                    v-model="pt.photos"
                    item-key="url"
                    class="flex flex-wrap gap-2 justify-center mt-2"
                  >
                    <template #item="{ element: ph, index: pi }">
                      <div class="relative w-16 h-16">
                        <img
                          :src="ph.previewUrl"
                          class="w-full h-full object-cover rounded"
                        />
                        <button
                          class="absolute top-0 right-0 bg-black/50 text-white rounded-full w-5 h-5"
                          @click.stop="store.removePhoto(index, pi)"
                        >
                          ✕
                        </button>
                      </div>
                    </template>
                  </draggable>
                  <!-- динамический ref -->
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    class="hidden"
                    :ref="createFileInputRef(index)"
                    @change="(e) => onFilesChange(e, index)"
                  />
                </div>
              </div>
            </div>
          </template>
        </draggable>

        <div v-if="!store.points.length" class="text-gray-500 mt-4">
          Точек пока нет
        </div>
      </fieldset>

      <!-- Кнопки действий -->
      <button @click="onSave" class="mt-6 btn btn-primary w-full">
        {{ isEdit ? 'Обновить' : 'Сохранить' }} маршрут
      </button>

      <button class="btn btn-error w-full mt-2" @click="onDelete">
        Удалить
      </button>
    </div>

    <!-- Карта -->
    <div class="w-1/2 relative">
      <LeafletMap />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouteStore } from '@/stores/routes'
import { useRoute, useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import RichTextEditor from '@/components/RichTextEditor.vue'
import LeafletMap from '@/components/map/LeafletMap.vue'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { useRoutesStore } from '@/stores/routes/routesList'

const routesStore = useRoutesStore()
const store = useRouteStore()
const route = useRoute()
const router = useRouter()
const isEdit = Boolean(route.params.id)
const coverInput = ref<HTMLInputElement | null>(null)
const fileInputs = ref<Array<HTMLInputElement | null>>([])

// фабрика корректных VNodeRef для динамических refs
const createFileInputRef = (idx: number) => (el: Element | null) => {
  fileInputs.value[idx] = el as HTMLInputElement | null
}

// Photo handlers
const triggerFileSelect = (idx: number) => {
  fileInputs.value[idx]?.click()
}
const onFilesChange = (e: Event, idx: number) => {
  const files = (e.target as HTMLInputElement).files
  if (files) store.addPhotosToPoint(idx, files)
}
const onFilesDrop = (e: DragEvent, idx: number) => {
  const files = e.dataTransfer?.files
  if (files) store.addPhotosToPoint(idx, files)
}

// Cover handlers
const triggerCoverSelect = () => {
  coverInput.value?.click()
}
const onCoverChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files) store.setCoverImage(files)
}
const onCoverDrop = (e: DragEvent) => {
  const files = e.dataTransfer?.files
  if (files) store.setCoverImage(files)
}

// Save route (create or update)
const onSave = async () => {
  try {
    await store.saveRoute()
  } catch {
    // ошибка уже показана
  }
}

// Delete route and redirect
const onDelete = async () => {
  if (!store.id) return
  try {
    await routesStore.deleteRoute(store.id)
    router.push('/admin')
  } catch {
    // ошибка уже показана
  }
}

onMounted(async () => {
  if (isEdit) {
    await store.fetchRouteById(route.params.id as string)
  }
})
</script>
