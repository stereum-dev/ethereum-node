import { useRouter } from "vue-router";

//Computed

//Functions

export function goToNext() {
  const router = useRouter();
  let fullPath = router.currentRoute.value.fullPath;

  switch (fullPath) {
    case "/config/upload":
      return "/config/list";
    case "/config/list":
      return "/config/sync";
    case "/config/sync":
      return "/config/verify";
    case "/config/verify":
      return "/config/play";
    default:
      return;
  }
}

// export function goToPrevious() {
//   const router = useRouter();
//   const fullPath = router.currentRoute.value.fullPath;

//   switch (fullPath) {
//     case "/config/upload":
//       return "/welcome";
//     case "/config/list":
//       return "/config/upload";
//     case "/config/sync":
//       return "/config/list";
//     case "/config/verify":
//       return "/config/sync";

//     default:
//       return;
//   }
// }
