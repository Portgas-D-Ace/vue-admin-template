<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
	.app-main {
	  /*50 = navbar  */
	  min-height: calc(100vh - 50px);
	  width: 100%;
	  position: relative;
	  overflow: hidden;
		padding: 40px;
	}
	.page-container {
		min-height: calc(100vh - 130px);
		width: 100%;
		position: relative;
		overflow: hidden;
		padding: 40px;
		border-radius: 20px;
		-webkit-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 60px rgba(0, 0, 0, 0.1);
		-moz-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1);
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1);
		background-color: white;
	}
</style>
