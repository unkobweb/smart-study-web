export default function (defaultCount = 0) {
  const counter = ref(defaultCount)

  function increment() {
    console.log('incrementing')
    counter.value++
  }

  function decrement() {
    console.log('decrementing')
    counter.value--
  }

  return { counter, increment, decrement }
}