<template>


<div id="list" class="columns is-mobile">
    <div class="column is-half is-offset-one-quarter">

      <input v-model="PlayerInfo" v-on:keyup.enter="onSubmit" placeholder="add a player">
        
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
</template>




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
                    alert("please login")
                })
        },
        methods: {

            getPath(photo) {
                  if(photo && photo.data)
                  return 'data:image/*;base64,' + (new Buffer(photo.data.data).toString('base64'));
                return '';
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
                            alert(res.data.message);
                        }, 1);
                    })
                    .catch(err => {
                        alert(err.response.data.error)
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
                                alert(res.data.message);
                            }, 1);
                        })
                        .catch(err => {
                            alert(err.response.data.error)
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
                                alert(res.data.message);
                            }, 1);
                        })
                        .catch(err => {
                            alert(err.response.data.error)
                        });
                }
            }
        }
    }
</script>