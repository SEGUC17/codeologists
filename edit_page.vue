<template >

   <div v-if="type_player">
      <br>
      <form autocomplete="off" method="POST" enctype="multipart/form-data" @submit.prevent="onSubmit_player">
     <label for="name">name</label><br>
     <input name = "name" type="text" id="name" v-model="user.name"><br>
     <label for="new_password">new_password</label><br>
     <input name = "new_password" type="password"  id="new_password" placeholder="new password" v-model="password"><br>
     <label for="email">email</label><br>
     <input name = "email" type="text" id="email" v-model="user.email"><br>
     <label for="phone_number">phone_number</label><br>
     <input name = "phone_number" type="text"  id="phone_number" v-model ="user.phone_number"><br>
     <label for="location">location</label><br>
     <input name = "location" type="text" id="location" v-model = "user.location"><br>
     <label for="profile_pic">profile_pic</label><br>
     <input id ="profile_pic" type="file" class="form-control" name="profile_pic" accept="image/*" v-on:change="onFile" multiple><br>
     <label for="birthdate">birthdate</label><br>
     <input name = "birthdate" required  type="date" id="birthdate" v-model="birthdate"><br>
     <label for="old_password">old_password</label><br>
     <input name = "old_password" type="password" id="old_password" placeholder="password" v-model="old_password"><br></br>
     <input type="submit" name="submit" value="update">
   </form>

    </div>
    <div v-else-if='type_provider'>
    <form autocomplete="off" class="form" enctype="multipart/form-data" method="POST" @submit.prevent ="onSubmit_serviceProvider">
          <label for="name">name</label><br>
          <input name="name" type="text" id="name" v-model ="user.name"><br>
          <label for="old_password">old_password</label><br>
          <input name="old_password" type="password" id="old_password" placeholder="old password" v-model="old_password"><br>
          <label for="new_password">new_password</label><br>
          <input name="new_password" type="password" id="new_password" v-model="password"><br>
          <label for="email">email</label><br>
          <input name="email" type="text" id="email" v-model = "user.email"><br>
          <label for="phone_number">phone_number</label><br>
          <input name="phone_number" type="text" id="phone_number" v-model ="user.phone_number"><br>
          <label for="profile_pic">profile_pic</label><br>
          <input id="profile_pic" type="file" class="form-control" name="profile_pic" accept="image/*" v-on:change="onFile" multiple><br>
          <div v-if ="user.mode">
            <label for="on">AutoAccept_mode_on</label>
            <input type="radio" id="on" name="mode" v-on:change="onMode" class="radio" checked><br>
            <label for="off">AutoAccept_mode_off</label>
            <input type="radio" id="off" name="mode" v-on:change="onMode" class="radio"><br>
          </div>
          <div v-else>
              <label for="on">AutoAccept_mode_on</label>
              <input type="radio" id="on" name="mode"  v-on:change="onMode" class="radio"><br>
              <label for="off">AutoAccept_mode_off</label>
              <input type="radio" id="off" name="mode"  v-on:change="onMode" class="radio" checked><br>
          </div>


                <input class="btn-primary form-control" type="submit" value="update">

    </form>
  </div>

</template>
<script>
     export default{
            data(){
              return{
                    user:[],
                    birthdate :'',
                    old_password:'',
                    password:'',
                    files :'',
                    mode:'',
                    type_player :false,
                    type_provider: false,
              };
            },
            created(){
              axios.get('/edit_profile')
              .then(response => {this.birthdate = response.data.date; this.user = response.data.result;
                    if(response.data.result.mode)
                      this.mode ="on";
                    else
                      this.mode ="off";
                    if(response.data.result.type == 'Player'){
                      this.type_player = true;
                      this.type_provider = false;
                    }else{
                      this.type_player = false;
                      this.type_provider = true;

                    }
              })
              .catch(error => alert(error.response.data.error));

            },
            methods:{
                       onSubmit_player(){
                         var dataForm = new FormData();
                         dataForm.append('name',this.user.name);
                         dataForm.append('email',this.user.email);
                         dataForm.append('new_password',this.password);
                         dataForm.append('old_password',this.old_password);
                         dataForm.append('phone_number',this.user.phone_number);
                         dataForm.append('location',this.user.location);
                         dataForm.append('birthdate',this.user.birthdate);
                         dataForm.append('profile_pic',this.files[0]);
                         axios.post('/edit_player_profile',dataForm)
                         .then(response => {alert('done');this.password ='',this.old_password=''})
                         .catch(error => {alert(error.response.data.error);this.birthdate = error.response.data.date; this.user = error.response.data.result;})
                       },onFile(event){
                         this.files = event.target.files
                       },onSubmit_serviceProvider(){
                         var dataForm = new FormData();
                         dataForm.append('name',this.user.name);
                         dataForm.append('email',this.user.email);
                         dataForm.append('new_password',this.password);
                         dataForm.append('old_password',this.old_password);
                         dataForm.append('phone_number',this.user.phone_number);
                         dataForm.append('location',this.user.location);
                         dataForm.append('mode',this.mode);
                         dataForm.append('profile_pic',this.files[0]);
                         axios.post('/edit_provider_profile',dataForm)
                         .then(response => {alert('done'),this.user = response.data.result;this.password ='',this.old_password=''})
                         .catch(error => {alert(error.response.data.error);this.user = error.response.data.result})
                       },onMode(event){
                         this.mode = event.target.id;
                       }

                    }
            }

</script>
