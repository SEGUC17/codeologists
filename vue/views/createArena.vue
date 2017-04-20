<template>
<div>
  <h1>Create a new arena</h1>
  <form action = "/createArena" method="post" @submit.prevent = "create" >
      <input type="text" placeholder="Arena name" v-model = "form.name" required="true"> <br>
      <input type="text" placeholder="Arena address" v-model = "form.address" required="true"> <br>
      <input type="text" placeholder="Arena size" v-model = "form.size" required="true"> <br>
      <input type="text" placeholder="Arena location" v-model = "form.location" required="true"> <br>
      <input type="text" placeholder="Arena type" v-model = "form.type" required="true"> <br>
      <input type="text" placeholder="Arena price" v-model = "form.price" required="true"> <br>
      <div class="control">
        <button class="button is-primary">Add Arena</button>
      </div>
  </form>
</div>
</template>

<script>
  export default{
    data() {
      return {
        form: new Form({
          name: '',
          address: '',
          location: '',
          size: '',
          type: '',
          price:''
        })
      }
    },

    methods: {
      create(){
        this.form.submit('post','/createArena')
				.then(res => {
          if(res.error)
            alert(res.error);
          else
					     alert('arena added');
				})
				.catch(err => {
					alert(err);
				});
      }
    }
  }
</script>
