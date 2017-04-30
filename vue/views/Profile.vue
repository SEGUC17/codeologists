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
        <div class="w3-container">
          <p><h2>{{profileUser.username}}</h2></p>
          <p><i class="fa fa-briefcase fa-fw w3-margin-right w3-large w3-text-teal"></i>{{profileUser.type}}</p>
          <p><i class="fa fa-home fa-fw w3-margin-right w3-large w3-text-teal"></i>{{profileUser.location}}</p>
          <p><i class="fa fa-envelope fa-fw w3-margin-right w3-large w3-text-teal"></i>{{profileUser.email}}</p>
          <p><i class="fa fa-phone fa-fw w3-margin-right w3-large w3-text-teal"></i>{{profileUser.phone_number}}</p>

          <br>

          <router-link to="/edit_profile" exact>Edit Profile</router-link>

          <br>
          <div v-if="type=='ServiceProvider'">

            <mode></mode>

          </div>

        </div>
      </div>

    <!-- End Left Column -->
    </div>

    <!-- Right Column -->
    <div class="w3-twothird">

      <div class="tabs is-centered is-medium">
      <ul>

        <li :class="{'is-active' : selectedTab=='ratings'}"><a @click="selectedTab='ratings'">Pending Ratings</a></li>

        <li v-if="profileUser.type=='ServiceProvider'" :class="{'is-active' : selectedTab=='arenas'}"><a @click="selectedTab='arenas'">My Arenas</a></li>

        <li v-if="profileUser.type=='ServiceProvider'" :class="{'is-active' : selectedTab=='bookings_SP'}"><a @click="selectedTab='bookings_SP'">Booking Requests</a></li>

        <li v-if="profileUser.type=='ServiceProvider'" :class="{'is-active' : selectedTab=='lists'}"><a @click="selectedTab='lists'">B/W Lists</a></li>

        <li v-if="profileUser.type=='Player'" :class="{'is-active' : selectedTab=='bookings_P'}"><a @click="selectedTab='bookings_P'">My Bookings</a></li>

        <li v-if="profileUser.type=='Player'" :class="{'is-active' : selectedTab=='games'}"><a @click="selectedTab='games'">Game Requests</a></li>

        <li v-if="profileUser.type=='Player'" :class="{'is-active' : selectedTab=='notifications'}"><a @click="selectedTab='notifications'">Notifications</a></li>

      </ul>
    </div>
    
      <div class="w3-container w3-card-2 w3-white w3-margin-bottom" v-if="selectedTab=='arenas'">
        <div class="w3-center">
          <p  class="w3-padding-16" ></p>
          <router-link tag="el-button" to="/createArena"><a>Create New Arena</a></router-link>
        </div>
        <br>
        <br>
        <arenas></arenas>

      </div>


      <div class="w3-container w3-card-2 w3-white w3-margin-bottom" v-if="selectedTab=='bookings_SP'">
        <pendingBookings></pendingBookings>

      </div>

      <div class="w3-container w3-card-2 w3-white w3-margin-bottom" v-if="selectedTab=='bookings_P'">
        <bookings></bookings>
      </div>

      <div class="w3-container w3-card-2 w3-white w3-margin-bottom" v-if="selectedTab=='ratings'">
        <rating></rating>

      </div>


      <div class="w3-container w3-card-2 w3-white w3-margin-bottom" v-if="selectedTab=='games'">
        <games></games>
        
      </div>

      <div class="w3-container w3-card-2 w3-white w3-margin-bottom" v-if="selectedTab=='notifications'">
        <notifications></notifications>

      </div>

      <div class="w3-container w3-card-2 w3-white w3-margin-bottom" v-if="selectedTab=='lists'">
        <whitelist></whitelist>

      </div>

      <div class="w3-container w3-card-2 w3-white w3-margin-bottom" v-if="selectedTab=='lists'">
        <blacklist></blacklist>

      </div>




    <!-- End Right Column -->
    </div>

  <!-- End Grid -->
  </div>

  <!-- End Page Container -->
</div>

</template>

<script >
  import rating from './NonRatedBookings';
  import bookings from './delete_booking';
  import mode from './changeMode';
  import blacklist from './Blacklist';
  import whitelist from './Whitelist';
  import arenas from './MyArenas';
  import pendingBookings from './ViewPendingBookings';
  import games from './Myrequests';
  import notifications from './Notifications';
  export default {
    data() {
      return {
        profileUser : '',
        selectedTab : 'ratings'
      }
    },
    computed : {
      user: function () { return this.$session.get('user'); },
      type: function () { return this.$session.get('type'); }
    },
    created() {
      axios.get('/findUser/'+this.$session.get('user'))
        .then(res =>{
          this.profileUser=res.data;
        })
        .catch(err =>{
          console.log(err);
        })
    },
    methods: {
      getPath(photo) {
                if(photo && photo.data)
                  return 'data:image/*;base64,' + (new Buffer(photo.data.data).toString('base64'));
                return 'default-user-image.png';
              },
    },
    components : {
      rating,
      bookings,
      mode,
      blacklist,
      whitelist,
      arenas,
      pendingBookings,
      notifications,
      games
    }
  }

</script>
