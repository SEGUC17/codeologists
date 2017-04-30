<template>
<div>
<div class="tile is-parent">
  <div class="tile is-vertical is-12">
    <div class="tile">
      <div class="tile is-parent is-vertical">
        <article class="tile is-child notification is-primary">
          <p class="title"> </p>
          <p class="subtitle"> <font face="Ubuntu"> You can add a player to a white/black list by specifying either his username or phone number</font></p>
        </article>
    </div>
</div>
</div>
</div>
<div id="list" class="w3-container">
    <div style="rcorners1" class="column is-half is-offset-one-quarter">
      <label class=" w3-card-2 w3-white w3-margin-bottom">
      <font face="Ubuntu">White list</font>
    </label>
    <br></br>
      <input class="input" v-model="PlayerInfo" v-on:keyup.enter="onSubmit" placeholder="add a player" style='width:70%'>
        
        <div v-for="(player, index) in players" v-bind:key="player" >
            <br>
          <article class="media" >

            <figure class="media-left">
              <p class="image is-64x64">
                <img :src="getPath(player.photo)" alt="profile img" />
              </p>
            </figure>
          <div class="media-content">
             <div class="content">
                <strong> {{ player.name }}</strong>  <small>@{{player.username}}</small>
                 <br/>
                 <p>{{player.phone}}</p>                        
             </div> 
          </div>
        <div class="media-right">
            <button class="delete" title="remove from list"  v-on:click="remove(player, index)"></button>
        </div>
    </article>

</div>
          
 </div>

</div>
</div>
</template>


<style >

#rcorners1 {
    border-radius: 25px;
    background: #73AD21;
    padding: 20px; 
    width: 120px;
    height: 50px; 
}


</style>



<script>
    export default {
        data() {
            return {
                PlayerInfo: '',
                players: []
            }
        },
        mounted() {
            axios.get('/profile/whiteList',
                    querystring.stringify({
                    }), {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    })
                .then(res => {
                    this.showPlayers(res.data.players)
                })
                .catch(err => {
                    //alert("please login")
                })
        },
        methods: {

            getPath(photo) {
                  if(photo && photo.data)
                  return 'data:image/*;base64,' + (new Buffer(photo.data.data).toString('base64'));
                return 'default-user-image.png';
              },

            showPlayers(players) {
                for (var i = 0; i < players.length; i++)
                    this.addNewPlayer(players[i]);
            },
            remove(player, index) {
                axios.post('/profile/removewhitelist',
                        querystring.stringify({
                            "PlayerUsername": player.username
                        }), {
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            }
                        })
                    .then(res => {
                        this.players.splice(index, 1);
                        setTimeout(function() {
                            this.$notify({title:"", message: res.data.message ,type:"success"});
                        }, 1);
                    })
                    .catch(err => {
                        this.$notify({title:"", message: err.response.data.error ,type:"warn"});
                    });
            },
            addNewPlayer(listedPlayer) {
                var player = {
                    name: listedPlayer.name,
                    username: listedPlayer.username,
                    phone: listedPlayer.phone_number,
                    photo: listedPlayer.profile_pic
                };
                this.players.push(player)
                this.PlayerInfo = ''
            },
            onSubmit: function() {
                if (isNaN(this.PlayerInfo)) {
                    axios.post('/profile/whitelist',
                            querystring.stringify({
                                "PlayerUsername": this.PlayerInfo
                            }), {
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                }
                            })
                        .then(res => {
                            this.addNewPlayer(res.data.listedPlayer)
                           setTimeout(function() {
                            this.$notify({title:"", message: res.data.message ,type:"success"});
                        }, 1);
                        })
                        .catch(err => {
                            this.$notify({title:"", message: err.response.data.error ,type:"warn"});
                        });
                } else {
                    axios.post('/profile/whitelist/phone',
                            querystring.stringify({
                                "phoneNumber": this.PlayerInfo
                            }), {
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                }
                            })
                        .then(res => {
                            this.addNewPlayer(res.data.listedPlayer)
                            setTimeout(function() {
                            this.$notify({title:"", message: res.data.message ,type:"success"});
                        }, 1);
                        })
                        .catch(err => {
                            this.$notify({title:"", message: err.response.data.error ,type:"warn"});
                        });
                }
            }
        }
    }
</script>
