export default async function (message: string, options: any = {}) {
  const { $event }: any = useNuxtApp()

  $event.$emit("show-snackbar", {
    message: message,
    ...options
  });
}