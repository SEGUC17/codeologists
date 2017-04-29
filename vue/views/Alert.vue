<template>
	<div class="modal is-active">
	  <div class="modal-background"></div>
	  <div class="modal-content">
	  	<div class="box">
	  		<slot></slot>
	  		<img src="/red.jpg">
	  	</div>
	  </div>
	  <button class="modal-close"></button>
	</div>
</template>