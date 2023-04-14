<template>
  <div>
    {{maVar}}
    {{maDoubleVar}}
    <button @click="incrementMaVar">Incrémenter</button>
  </div>
</template>

<script setup>
const props = defineProps(['monProps'])

const maVar = ref(props.monProps || 0)
const maDoubleVar = computed(() => maVar.value * 2)

const incrementMaVar = () => {
  maVar.value++
}

// exemple of watcher
watch(maVar, (newValue, oldValue) => {
  console.log('maVar changed from', oldValue, 'to', newValue)
})
</script>