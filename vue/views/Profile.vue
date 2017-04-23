<template>

		<div v-if="user" class="w3-content w3-margin-top" style="max-width:1400px;">

  <!-- The Grid -->
  <div class="w3-row-padding">
  
    <!-- Left Column -->
    <div class="w3-third">
    
      <div class="w3-white w3-text-grey w3-card-4 w3-margin-bottom">
        <div class="w3-display-container">
          <img :src="getPath(profileUser.profile_pic)" style="width:100%" alt="Avatar">
          
        </div>
        <br>
        <h1>Auto Accept Mode</h1>
        <br>
        <div class="w3-container">
        	<p><h2>{{profileUser.username}}</h2></p>
          <p><i class="fa fa-briefcase fa-fw w3-margin-right w3-large w3-text-teal"></i>{{profileUser.type}}</p>
          <p><i class="fa fa-home fa-fw w3-margin-right w3-large w3-text-teal"></i>{{profileUser.location}}</p>
          <p><i class="fa fa-envelope fa-fw w3-margin-right w3-large w3-text-teal"></i>{{profileUser.email}}</p>
          <p><i class="fa fa-phone fa-fw w3-margin-right w3-large w3-text-teal"></i>{{profileUser.phone_number}}</p>

          <br>

          <router-link to="/edit_profile" exact>edit</router-link>

          <br>

          <router-link tag="li" to="/changeMode"><a>Turn On/Off</a></router-link>




        </div>
      </div>

      <div class="w3-container w3-card-2 w3-white w3-margin-bottom" v-if="profileUser.type=='ServiceProvider'">
        <h2 class="w3-text-grey w3-padding-16">Black List</h2>
        <router-link class="nav-item" tag="li" to="/blackList"><a>Black List</a></router-link>
        
      </div>

      <div class="w3-container w3-card-2 w3-white w3-margin-bottom" v-if="profileUser.type=='ServiceProvider'">
        <h2 class="w3-text-grey w3-padding-16">White List</h2>
        <router-link class="nav-item" tag="li" to="/whiteList"><a>White List</a></router-link>
        
      </div>

    <!-- End Left Column -->
    </div>

    <!-- Right Column -->
    <div class="w3-twothird">
    
      <div class="w3-container w3-card-2 w3-white w3-margin-bottom" v-if="profileUser.type=='ServiceProvider'">
        <h2 class="w3-text-grey w3-padding-16">My Arenas</h2>
        <router-link tag="li" to="/createArena"><a>create arena</a></router-link>

        <router-link class="nav-item" to="/myArenas">
          <a>My Arenas</a>
          </router-link>
        
      </div>

      <div class="w3-container w3-card-2 w3-white w3-margin-bottom" v-if="profileUser.type=='ServiceProvider'">
        <h2 class="w3-text-grey w3-padding-16">Booking Requests</h2>
        <router-link tag="li" to="/ViewPendingBookings"><a>View Bookings</a></router-link>
        
      </div>

      <div class="w3-container w3-card-2 w3-white w3-margin-bottom" v-if="profileUser.type=='Player'">
        <h2 class="w3-text-grey w3-padding-16">My Bookings</h2>
        <router-link tag="li" to="/cancelBooking"><a>cancel booking</a></router-link>
      </div>

      <div class="w3-container w3-card-2 w3-white w3-margin-bottom">
        <h2 class="w3-text-grey w3-padding-16">Pending Ratings</h2>
        <rating></rating>
        
      </div>

      <div class="w3-container w3-card-2 w3-white w3-margin-bottom" v-if="profileUser.type=='Player'">
        <h2 class="w3-text-grey w3-padding-16">Game Requests</h2>
        <router-link class="nav-item" to="/myrequests"><a>My requests</a></router-link>
        
      </div>

      <div class="w3-container w3-card-2 w3-white w3-margin-bottom" v-if="profileUser.type=='Player'">
        <h2 class="w3-text-grey w3-padding-16">Notifications</h2>
        <router-link class="nav-item" to="/notifications"><a>Notifications</a></router-link>
        
      </div>


      

    <!-- End Right Column -->
    </div>
    
  <!-- End Grid -->
  </div>
  
  <!-- End Page Container -->
</div>

</template>

<script >

  import rating from './NonRatedBookings.vue';

	export default {
		data() {
			return {
				profileUser : ''
			}
		},

		computed : {
			user: function () { return window.user; }
		},

		created() {
			axios.get('/findUser/'+window.user)
				.then(res =>{
					this.profileUser=res.data;
				})
				.catch(err =>{
					console.log(err);
				})
		},

		methods: {
			getPath(photo) {
        return 'data:image/*;base64,' + (new Buffer(photo.data.data).toString('base64'));
			}
		},

    components : {
      rating
    }
	}
	


</script>