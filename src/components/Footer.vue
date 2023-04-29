<template>
  <nav text-xl mt-6 inline-flex gap-2>
    <button icon-btn @click="toggleDark()">
      <div dark:i-carbon-moon i-carbon-sun />
    </button>

    <a icon-btn i-carbon-logo-github rel="noreferrer" href="https://github.com/antfu/vitesse-lite" target="_blank"
      title="GitHub" />
  </nav>
</template>
<script lang="ts"  setup>

let ws = ref()
function sendWs() {
  ws.value = new WebSocket(`ws://175.30.32.3:7200/api/carChanged?token=${localStorage.getItem('token')}`);

  ws.value.onopen = function (e) {
    // e.target.send(JSON.stringify({ 'token': 'a9fe9c1a-8969-41f4-894c-0ca93c921ceb' }));
    // ws.value.send("My name is John");
  };

  ws.value.onmessage = function (event) {
    console.log(event)
  };

  ws.value.onclose = function (event) {
    console.log(event)
    if (event.wasClean) {
    } else {
      // e.g. server process killed or network down
      // event.code is usually 1006 in this case
    }
  };

  ws.value.onerror = function (error) {
    console.log(error)
  };
}

sendWs()


</script>
