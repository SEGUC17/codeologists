<template>

<div id="list">
       
            <input v-model="PlayerUsername" v-on:keyup.enter="onSubmit" placeholder="add a player">
       
        <ul>
            <div v-for="(player, index) in players" v-bind:key="player"  v-on:remove="remove(index)">

    <li>
      {{ player }}
      <button v-on:click="$emit('remove')">X</button>
    </li>

            </div>
        </ul>
    </div>

</template>



<script>
    export default {

        data() {
            return {
                PlayerUsername: '',
                players: [
                    'Ramos',
                    'Ahmed',
                    'Tarek'
                ],
                errors: {}
            }
        },
        methods: {
            remove: function(index) {
                this.players.splice(index, 1);
            },
            addNewPlayer: function() {
                this.players.push(this.PlayerUsername)
                this.PlayerUsername = ''
            },
            onSubmit: function() {

                axios.post('/profile/blacklist',
                        querystring.stringify({
                            "PlayerUsername": this.PlayerUsername
                        }), {
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            }
                        })
                    .then(res => addNewPlayer())
                    .catch(error => this.errors = ['error']);

                //     axios.post('/profile/blacklist', this.$data)

                //  .then(res => addNewPlayer)
                //    .catch(error => this.errors = ['error']);
            }
        }
    }
</script>