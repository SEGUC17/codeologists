<template>

    <div class="w3-container">
        <div class="w3-quarter">&nbsp</div>

        <div class=" w3-center w3-half">

            <br>
            <router-link class="button w3-blue" v-if="type=='Player'" tag="button" to='/createGame'>
                Create New Game
            </router-link>
            <br>
            <div v-for="game in games">

                <el-card style="width: 650px">
                    <div slot="header" class="clearfix">
                        <span style="float:left line-height: 36px; font-size: 18px; font-weight: bold;">
                    Game Request by {{ game.creator }}
                        </span>

                        <button class="w3-green" style="float: right;" type="success" @click="selectReq" :value="games.indexOf(game)">
                            Request Game
                        </button>
                    </div>
                    <div>
                        <table>
                            <tr style="font-size: 12px">
                                <td>
                                    <span style="font-weight: bold">
                                Size
                                </span> : {{ game.size }}
                                </td>
                                <td>
                                    <span style="font-weight: bold">
                                Location 
                                </span> : {{ game.location }}
                                </td>
                                <td>
                                    <span style="font-weight: bold">
                                Start date
                                </span> : {{date(game.start_date)}}
                                </td>
                                <td>
                                    <span style="font-weight: bold">
                                End date
                                </span> : {{date(game.end_date)}}
                                </td>
                            </tr>
                        </table>
                    </div>
                </el-card>
                <br>
                <br>
                <!-- <article class="message">
                <div class="message-header">
                    <p>Game details</p>
                </div>
                <h3>Creator : {{ game.creator }}</h3>
                <h3>Size : {{ game.size }}</h3>
                <h3>Location : {{ game.location }}</h3>
                <h3>Start date : {{ game.start_date }}</h3>
                <h3>End date : {{ game.end_date }}</h3>

                <button type="button" class="button is-info" :value="games.indexOf(game)" @click="selectReq">Send a request</button>

            </article>
 -->
                <div v-if="showmodal">
                    <div class="modal is-active">
                        <div class="modal-background"></div>
                        <div class="modal-content">
                            <div class="box">
                                <form action="/RequestGame" method="POST" @submit.prevent="onsubmit(selected)">
                                    <div class="field">
                                        <input class="input" required pattern="^01[0-2]{1}[0-9]{8}" placeholder="Your Phone Number..." v-model="form.phone" title="please enter a valid phone number">
                                    </div>
                                    <div class="field">
                                        <input class="textarea" required placeholder="Add a comment..." v-model="form.comment">
                                    </div>
                                    <button type="submit" class="button is-info">
                            Send The Request
                            </button>
                                </form>
                            </div>
                        </div>
                        <button class="modal-close" @click="showmodal=false"></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    export default {
        data() {
            return {
                form: new Form({
                    phone: "",
                    comment: ""
                }),
                games: [],
                showmodal: false,
                selected: ''
            }
        },
        created() {
            axios.get("/viewgames").then(res => {
                this.games = res.data

            });
        },
        methods: {

            date(inp) {

                return (inp.substring(8, 10)) + " / " + (inp.substring(5, 7)) + " / " + (inp.substring(0, 4));
            },
            onsubmit(game) {
                this.form.submit('post', '/RequestGame/' + this.games[game]._id).then(response => alert(response))
                    .catch(errors => alert(errors));

            },
            selectReq(e) {
                console.log(e.target);
                this.showmodal = true;
                var x = e.target.value;
                this.selected = x;
                this.$forceUpdate();
            }

        },
        computed: {
            user: function () { return window.user; },
            type: function () { return window.type; }
        }
    }

</script>