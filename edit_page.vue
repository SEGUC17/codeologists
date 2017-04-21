<template >

   <div v-if="type_player" class="field is-grouped container">
    <form autocomplete="off" method="post" action="/signup" @submit.prevent="onSubmit_player">
     <div class="field">
       <label  class="label">Name</label>
       <input type="text" name="name" class="input" placeholder="name" v-model="user.name" @keydown="delete errors['name']">
       <span class="help is-danger" v-if="errors.hasOwnProperty('name')" v-text="errors['name']"></span>
     </div>
     <div class="field">
       <label  class="label">New Password</label>
       <input type="password" name="new_password" class="input" placeholder="new Password" v-model="password">
     </div>
     <div class="field">
       <label  class="label">Email</label>
       <input type="text" name="email" class="input" placeholder="Email" v-model="user.email" @keydown="delete errors['email']">
        <span class="help is-danger" v-if="errors.hasOwnProperty('email')" v-text="errors['email']"></span>
     </div>
     <div class="field">
       <label  class="label">Location</label>
       <input type="text" name="location" class="input" placeholder="Location" v-model="user.location" @keydown="delete errors['location']">
        <span class="help is-danger" v-if="errors.hasOwnProperty('location')" v-text="errors['location']"></span>
     </div>
     <div class="field">
       <label  class="label">Phone number</label>
       <input type="text" name="phone_number" class="input" placeholder="Phone number" v-model="user.phone_number" @keydown="delete errors['phone_number']">
        <span class="help is-danger" v-if="errors.hasOwnProperty('phone_number')" v-text="errors['phone_number']"></span>
     </div>
     <div class="field">
       <label  class="label" >Birthdate</label>
       <input required type="date" name="birthdate" class="input" v-model="birthdate">
     </div>
     <div class="field">
       <label  class="label">Profile picture</label>
       <input type="file" name="profile_pic" class="input" placeholder="Profile picture" v-on:change="onFile" multiple>
     </div>
     <div class="field">
       <label  class="label">Current Password</label>
       <input type="password" name="password" class="input" placeholder="Current Password" v-model="old_password" @keydown="delete errors['old_password']">
       <span class="help is-danger" v-if="errors.hasOwnProperty('old_password')" v-text="errors['old_password']"></span>
     </div>

     <div class="field">
       <button class="button is-primary">Update</button>
        <span class="help is-success" v-if="success" >Information updated successfully</span>
     </div>
   </form>
    </div>

    <div v-else-if='type_provider' class="field is-grouped container">
    <form autocomplete="off" class="form" enctype="multipart/form-data" method="POST" @submit.prevent ="onSubmit_serviceProvider">
      <div class="field">
        <label  class="label">Name</label>
        <input type="text" name="name" class="input" placeholder="name" v-model="user.name" @keydown="delete errors['name']">
        <span class="help is-danger" v-if="errors.hasOwnProperty('name')" v-text="errors['name']"></span>
      </div>
      <div class="field">
        <label  class="label">New Password</label>
        <input type="password" name="new_password" class="input" placeholder="new Password" v-model="password">
      </div>
      <div class="field">
        <label  class="label">Email</label>
        <input type="text" name="email" class="input" placeholder="Email" v-model="user.email" @keydown="delete errors['email']">
         <span class="help is-danger" v-if="errors.hasOwnProperty('email')" v-text="errors['email']"></span>
      </div>
      <div class="field">
        <label  class="label">Phone number</label>
        <input type="text" name="phone_number" class="input" placeholder="Phone number" v-model="user.phone_number" @keydown="delete errors['phone_number']">
         <span class="help is-danger" v-if="errors.hasOwnProperty('phone_number')" v-text="errors['phone_number']"></span>
      </div>
      <div class="field">
        <label  class="label">Profile picture</label>
        <input type="file" name="profile_pic" class="input" placeholder="Profile picture" v-on:change="onFile" multiple>
      </div>
          <div v-if ="user.mode" class="field">
            <label class="label"for="on">AutoAccept_mode_on</label>
            <input type="radio" id="on" name="mode" v-on:change="onMode" class="radio" checked><br>
            <label class="label"for="off">AutoAccept_mode_off</label>
            <input type="radio" id="off" name="mode" v-on:change="onMode" class="radio"><br>
          </div>
          <div v-else class="field">
              <label class="label"for="on">AutoAccept_mode_on</label>
              <input type="radio" id="on" name="mode"  v-on:change="onMode" class="radio"><br>
              <label class ="label"for="off">AutoAccept_mode_off</label>
              <input type="radio" id="off" name="mode"  v-on:change="onMode" class="radio" checked><br>
          </div>
          <div class="field">
            <label  class="label">Current Password</label>
            <input type="password" name="password" class="input" placeholder="Current Password" v-model="old_password" @keydown="delete errors['old_password']">
            <span class="help is-danger" v-if="errors.hasOwnProperty('old_password')" v-text="errors['old_password']"></span>
          </div>

          <div class="field">
            <button class="button is-primary">Update</button>
             <span class="help is-success" v-if="success" >Information updated successfully</span>
          </div>

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
                    errors:[],
                    success: false,
                    getPath(photo){
                      if(photo)
    return 'data:image/*;base64,'+(new Buffer(photo.data.data).toString('base64'));
}
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
                         dataForm.append('birthdate',this.birthdate);
                         dataForm.append('profile_pic',this.files[0]);
                         axios.post('/edit_player_profile',dataForm)
                         .then(response => {this.errors=[];this.success = true;this.password ='',this.old_password='';this.birthdate = response.data.date; this.user = response.data.result})
                         .catch(error => {
                           this.success = false;
                           this.birthdate = error.response.data.date;
                           this.user = error.response.data.result;
                           var errs = [];
                           for (var i = 0; i < error.response.data.errors.length; i++) {
                               var e = error.response.data.errors[i];
                               var param = e.param;
                               errs[e.param] = e.msg;
                           }
                              this.errors = errs;
                         })
                       },onFile(event){
                         this.files = event.target.files
                       },onSubmit_serviceProvider(){
                         var dataForm = new FormData();
                         dataForm.append('name',this.user.name);
                         dataForm.append('email',this.user.email);
                         dataForm.append('new_password',this.password);
                         dataForm.append('old_password',this.old_password);
                         dataForm.append('phone_number',this.user.phone_number);
                         dataForm.append('mode',this.mode);
                         dataForm.append('profile_pic',this.files[0]);
                         axios.post('/edit_provider_profile',dataForm)
                         .then(response => {this.errors=[];this.success= true;this.user = response.data.result;this.password ='',this.old_password=''})
                         .catch(error => {this.user = error.response.data.result;
                                          this.success = false;
                                          var errs = [];
                                          for (var i = 0; i < error.response.data.errors.length; i++) {
                                              var e = error.response.data.errors[i];
                                              var param = e.param;
                                              errs[e.param] = e.msg;
                                          }
                                             this.errors = errs;
                         })
                       },onMode(event){
                         this.mode = event.target.id;
                       }

                    }
            }

</script>
