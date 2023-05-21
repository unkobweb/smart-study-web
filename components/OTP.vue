<template>
  <div ref="otpCont">
    <input
      :disabled="props.disabled"
      type="text"
      class="digit-box"
      v-for="(el, ind) in digits"
      :key="el+ind"
      v-model="digits[ind]"
      :autofocus="ind === 0"
      maxlength="1"
      @keydown="handleKeyDown($event, ind)"
    >
  </div>
</template>

<script setup>
const props = defineProps({
  default: String,
  disabled: {
    type: Boolean,
    default: false
  },
  digitCount: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['update:modelValue'])

const digits = reactive([])

if (props.default && props.default.length === props.digitCount) {
  for (let i =0; i < props.digitCount; i++) {
    digits[i] = props.default.charAt(i)
  }
} else {
  for (let i =0; i < props.digitCount; i++) {
    digits[i] = null;
  }
}

const handleKeyDown = function (event, index) {
    if (event.key !== "Tab" && 
        event.key !== "ArrowRight" &&
        event.key !== "ArrowLeft"
    ) {
      event.preventDefault();
    }
    
    if (event.key === "Backspace") {
      digits[index] = null;
      
      if (index != 0) {
        (otpCont.value.children)[index-1].focus();
      } 

    }

    if ((new RegExp('^([0-9])$')).test(event.key)) {
      digits[index] = event.key;

      if (index != props.digitCount - 1) {
        (otpCont.value.children)[index+1].focus();
      }
    }

    emit('update:modelValue', digits.join(''))
  }

const otpCont = ref(null)
</script>

<style scoped>
.digit-box {
    height: 70px;
    width: 50px;
    border: 2px solid #1976D2;
    color: #1976D2;
    border-radius: 5px;
    margin: 5px;
    text-align: center;
    background-color: #E6EFFF;
    outline: none;
    font-size: 36px;
    line-height: 0%;
}

/* add margin right to 3rd .digit-box */
.digit-box:nth-child(3) {
  margin-right: 20px;
}
</style>