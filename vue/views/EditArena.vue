<template>
	
	<div v-if="type=='ServiceProvider'">

		<div class="tabs is-centered is-medium">
		  <ul>
		    <li :class="{'is-active' : selectedTab=='info'}"><a @click="selectedTab='info'">Info</a></li>
		    <li :class="{'is-active' : selectedTab=='images'}"><a @click="selectedTab='images'">Images</a></li>
		    <li :class="{'is-active' : selectedTab=='schedule'}"><a @click="selectedTab='schedule'">Default schedule</a></li>
		  </ul>
		</div>

		<!--Start of edit arena info form-->

		<div class="w3-container w3-center w3-margin">
			<form method="post" action="/editarenainfo" v-if="selectedTab=='info'" @submit.prevent="saveChanges" @keydown="form.errors.clear($event.target.name)">
			<div class="control">
				<label for="rules_and_regulations" class="label">Rules and Regulations</label>
				<input type="text" name="rules_and_regulations" class="input" placeholder="rules and regulations" v-model="form.rules_and_regulations">
				<span class="help is-danger" v-if="form.errors.has('rules_and_regulations')" v-text="form.errors.get('rules_and_regulations')"></span>
			</div>
			<br>
			<div class="control">
				<label for="location" class="label">Location</label>
				<input type="text" name="location" class="input" placeholder="location" v-model="form.location">
				<span class="help is-danger" v-if="form.errors.has('location')" v-text="form.errors.get('location')"></span>
			</div>
			<br>
			<div class="control">
				<label for="address" class="label">Address</label>
				<input type="text" name="address" class="input" placeholder="detailed address" v-model="form.address">
				<span class="help is-danger" v-if="form.errors.has('address')" v-text="form.errors.get('address')"></span>
			</div>
			<br>
			<div class="control">
				<label for="type" class="label">Type</label>
				<input type="text" name="type" class="input" placeholder="arena type" v-model="form.type">
				<span class="help is-danger" v-if="form.errors.has('type')" v-text="form.errors.get('type')"></span>
			</div>
			<br>
			<div class="control">
				<label for="size" class="label">Number of players</label>
				<input type="number" name="size" class="input" placeholder="number of players" v-model="form.size">
				<span class="help is-danger" v-if="form.errors.has('size')" v-text="form.errors.get('size')"></span>
			</div>
			<br>
			<div class="control">
				<label for="price" class="label">Price</label>
				<input type="number" name="price" class="input" placeholder="price per hour" v-model="form.price">
				<span class="help is-danger" v-if="form.errors.has('price')" v-text="form.errors.get('price')"></span>
			</div>
			<br>
			<div class="control">
				<button class="button is-primary">Save changes</button>
			</div>
			<br>
			<br>
		</form>

		</div>

		<!--End of edit arena info form-->

		<!--Start of images part-->

		<div v-if="selectedTab=='images'" class="w3-container">

		<!-- Arena images dispaly -->

		<div class="w3-row-padding">
			<div class="w3-third" v-for="photo in photos">
				<img :src="getPath(photo)" style="width:100%" @click="dispalyImage(getPath(photo))" alt="arena image">
			</div>
		</div>

		<!-- Modal for full size images on click-->
		<div id="modal01" class="w3-modal w3-black" style="padding-top:0" onclick="this.style.display='none'">
			<div class="w3-modal-content w3-animate-zoom w3-center w3-transparent w3-padding-64">
				<img id="img01" class="w3-image">
			</div>
		</div>

		<!-- Adding a new image -->

		<form autocomplete="off" method="POST" enctype="multipart/form-data" @submit.prevent="addImage">

			<h2>Add New Image</h2>

			<input id="new_image" type="file" class="form-control" name="new_image" accept="image/*" @change="onFile" multiple><br>
			<br>
			<div class="control">
				<button class="button is-primary">Add</button>
			</div>
		</form>
		<br>
		<br>
		</div>

		<!--End of images part-->

		<!--Start of the schedule part-->

		<div v-if="selectedTab=='schedule'">

		<div class="w3-center">
			<div class="w3-half">
				<div class="w3-dropdown-hover">
					<button class="w3-button w3-black w3-hover-red">Choose Day</button>
					<div class="w3-dropdown-content w3-bar-block w3-border">
						<a v-for="i in 7" class="w3-bar-item w3-button" @click="selectDay(i-1)">{{days[i-1]}}</a>
					</div>
				</div>
			</div>

			<h3 class="w3-half w3-text-red">{{days[currentDay]}}</h3>

		</div>


		<table v-for="j in 7" v-if="j-1==currentDay" class="table is-bordered">
			<tr>
				<td v-for="i in 12" >
					<div class="w3-center" @click="toggleSlot(j-1,i-1)">
						<a>
							<p><b>{{slots[i-1]}}</b></p>
							<img v-if="schedule[j-1][i-1]==-1" src="cross.png">
							<img v-if="schedule[j-1][i-1]==0" src="tick.png">
						</a>
					</div>
				</td>
			</tr>

			<tr>
				<td v-for="i in 12" >
					<div class="w3-center" @click="toggleSlot(j-1,i+11)">
						<a>
							<p><b>{{slots[i+11]}}</b></p>
							<img v-if="schedule[j-1][i+11]==-1" src="cross.png">
							<img v-if="schedule[j-1][i+11]==0" src="tick.png">
						</a>
					</div>
				</td>
			</tr>

			<tr>
				<td v-for="i in 12" >
					<div class="w3-center" @click="toggleSlot(j-1,i+23)">
						<a>
							<p><b>{{slots[i+23]}}</b></p>
							<img v-if="schedule[j-1][i+23]==-1" src="cross.png">
							<img v-if="schedule[j-1][i+23]==0" src="tick.png">
						</a>
					</div>
				</td>
			</tr>

			<tr>
				<td v-for="i in 12" >
					<div class="w3-center" @click="toggleSlot(j-1,i+35)">
						<a>
							<p><b>{{slots[i+35]}}</b></p>
							<img v-if="schedule[j-1][i+35]==-1" src="cross.png">
							<img v-if="schedule[j-1][i+35]==0" src="tick.png">
						</a>
					</div>
				</td>
			</tr>
		</table>

		<button class="button is-primary" @click="updateSchedule">Update Schedule</button>
		<br>
		<br>
		</div>

		<!--End of the schedule part-->

	</div>

</template>

<script>
	export default {
		data() {
			return {
				form: new Form({
					rules_and_regulations: '',
					location: '',
					address: '',
					size: '',
					price: '',
					type: ''
				}),
				photos: {},
				files: '',
				schedule: [],
				slots: [],
				days: [],
				currentDay: 0,
				selectedTab : 'info'
			}
		},

		created() {
			Event.$on('edit-arena', arena => {
				this.form = new Form(arena);
				this.photos = [].concat(arena.photos);
				this.schedule = arena.default_weekly_schedule;
				this.slots = new Array(48);
				var start = 11;
				var am = true;
				for (var i = 0; i < 48; i += 2) {
					var t1 = (start % 12 + 1) + ":00";
					var t2 = (start % 12 + 1) + ":30";
					var t3 = ((start + 1) % 12 + 1) + ":00";
					this.slots[i] = t1 + " : " + t2 + (am ? " AM" : " PM");
					this.slots[i + 1] = t2 + " : " + t3 + (am ? " AM" : " PM");
					start++;
					if (i == 22)
						am = false;
				}

				this.days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
				this.currentDay = 0;


			});
		},

		computed: {
  			user: function () { return window.user; },
  			type: function () { return window.type; }
		},

		methods: {
			saveChanges() {
				this.form.submit('post', '/editarenainfo/' + this.form._id)
					.then(arena => {
						this.$router.push('/myArenas');
					})
					.catch(err => {
					});
			},

			addImage() {
				var dataForm = new FormData();
				dataForm.append('new_image', this.files[0]);
				axios.post('/addarenaimage/' + this.form._id, dataForm)
					.then(arena => {
						this.$router.push('/myArenas');
					})
					.catch(err => {
					});
			},

			onFile(event) {
				this.files = event.target.files
			},

			getPath(photo) {
				if(photo && photo.data)
                  return 'data:image/*;base64,' + (new Buffer(photo.data.data).toString('base64'));
                return '';
			},

			// Modal Image Gallery
			dispalyImage(element) {
				document.getElementById("img01").src = element;
				document.getElementById("modal01").style.display = "block";
			},

			selectDay(day) {
				this.currentDay = day;
			},

			toggleSlot(day, slot) {
				if (this.schedule[day][slot] == 0) {
					this.schedule[day][slot] = -1;
				} else {
					this.schedule[day][slot] = 0;
				}
				this.currentDay+=1;
				this.currentDay-=1;
			},

			updateSchedule() {
				var x = [];
				for (var i = 0; i < 7; i++)
					for (var j = 0; j < 48; j++)
						if (this.schedule[i][j] == -1)
							x.push(i + "," + j);
				axios.post('/editdefaultschedule/' + this.form._id, querystring.stringify({ schedule: x }), { headers: { "Content-Type": "application/x-www-form-urlencoded" } })
					.then(arena => {
						this.$router.push('/myArenas');
					})
					.catch(err => {
					});
			}

		}

	}

</script>