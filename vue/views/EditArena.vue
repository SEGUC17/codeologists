<template>



	<div>
		
		<!--Start of edit arena info form-->

		<form method="post" action="/editarenainfo" @submit.prevent="saveChanges" @keydown="form.errors.clear($event.target.name)">
			<div class="control">
				<label for="name" class="label">Rules and Regulations</label>
				<input type="text" name="rules_and_regulations" class="input" placeholder="rules and regulations" v-model="form.rules_and_regulations" >
				<span class="help is-danger" v-if="form.errors.has('rules_and_regulations')" v-text="form.errors.get('rules_and_regulations')"></span>
			</div>
			<div class="control">
				<label for="name" class="label">Location</label>
				<input type="text" name="location" class="input" placeholder="location" v-model="form.location">
				<span class="help is-danger" v-if="form.errors.has('location')" v-text="form.errors.get('location')"></span>
			</div>
			<div class="control">
				<label for="name" class="label">Address</label>
				<input type="text" name="address" class="input" placeholder="detailed address" v-model="form.address">
				<span class="help is-danger" v-if="form.errors.has('address')" v-text="form.errors.get('address')"></span>
			</div>
			<div class="control">
				<label for="name" class="label">Type</label>
				<input type="text" name="type" class="input" placeholder="arena type" v-model="form.type">
				<span class="help is-danger" v-if="form.errors.has('type')" v-text="form.errors.get('type')"></span>
			</div>
			<div class="control">
				<label for="name" class="label">Number of players</label>
				<input type="text" name="size" class="input" placeholder="number of players" v-model="form.size">
				<span class="help is-danger" v-if="form.errors.has('size')" v-text="form.errors.get('size')"></span>
			</div>
			<div class="control">
				<label for="name" class="label">Price</label>
				<input type="text" name="price" class="input" placeholder="price per hour" v-model="form.price">
				<span class="help is-danger" v-if="form.errors.has('price')" v-text="form.errors.get('price')"></span>
			</div>
			<div class="control">
				<button class="button is-primary">Save changes</button>
			</div>
		</form>

		<!--End of edit arena info form-->
		
		<!--Start of adding a new arena image-->

		<!-- Start of display images-->

		<img v-for="photo in photos" class="mySlides" src="paris.jpg" style="width:100%" alt="arena_image">


		<!-- End of display images-->

		<form autocomplete="off" method="POST" enctype="multipart/form-data" @submit.prevent="addImage">
    
     		<label for="new_image">New Image</label><br>
     			<input id ="new_image" type="file" class="form-control" name="new_image" accept="image/*" @change="onFile" multiple><br>
     
     		<div class="control">
				<button class="button is-primary">Add</button>
			</div>
   		</form>

		<!--End of adding a new arena image-->

	</div>

</template>

<script>

	export default {
		data(){
			return {
				form : new Form({
					rules_and_regulations : '',
					location : '',
					address : '',
					size : '',
					price : '',
					type : ''
				}),
				photos : {},
				files : '',
				schedule : []
			}
		},

		created(){
			Event.$on('edit-arena',arena=> {
				this.form=new Form(arena);
				this.photos=[].concat(arena.photos);
				this.schedule=arena.default_weekly_schedule;
			});		
		},

		methods : {
			saveChanges(){
				this.form.submit('post','/editarenainfo/'+this.form._id)
				.then(arena => {
					this.$router.push('/myArenas');
				})
				.catch(err => {
					alert(err);
				});
			},

			addImage(){
				var dataForm = new FormData();
				dataForm.append('new_image',this.files[0]);
				axios.post('/addarenaimage/'+this.form._id,dataForm)
				.then(arena =>{
					this.$router.push('/myArenas');
				})
				.catch(err =>{
					alert(err);
				});
			},

			onFile(event){
            	this.files = event.target.files
            }
		}

	}
</script>