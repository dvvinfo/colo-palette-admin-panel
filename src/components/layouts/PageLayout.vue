<template>
  <div class="container mx-auto w-full"></div>
  <div class="bg-background text-white mx-auto px-4 py-8">
    <AppHeader />

    <main class="container mx-auto w-full">
      <slot />
    </main>
    <AppFooter />

    <NotificationModal />
  </div>
</template>
