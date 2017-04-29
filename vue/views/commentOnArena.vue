<template>

  <div class="w3-container">
    <h4 :load="refresh()" class="w3-margin-left"> Comments </h4>
    <div>
      <div v-for="comment in initialcomments">

        <div class="box w3-twothird w3-margin-left w3-display-container">
          <article class="media">
            <div class="media-content">
              <div class="content">
                <p>
                  <strong>{{	comment.player }}</strong>
                  <small class="w3-display-topright w3-padding-16 w3-margin-right ">{{	calcDate(comment.time_stamp) }}</small>
                  <br>
                  {{	comment.Content }}
                </p>
              </div>
              <nav class="level is-mobile">
                <div class="level-left">
                  <a class="level-item">
                    <span class="icon is-small"><i class="fa fa-reply"></i></span>
                  </a>
                  <a class="level-item">
                    <span class="icon is-small"><i class="fa fa-retweet"></i></span>
                  </a>
                  <a class="level-item">
                    <span class="icon is-small"><i class="fa fa-heart"></i></span>
                  </a>
                </div>
              </nav>
            </div>
          </article>
        </div>

      </div>
    </div>
    <form v-if="type==='Player'" class="w3-twothird w3-padding-16" method = "post" @submit.prevent="saveChanges">
      <div>
        <input required type="text" id="comment" placeholder = "Write a comment .." name="comment" class = "input w3-margin-left" v-model="comment">
      </div>
      <br>
      <div class="w3-margin-left control">
        <button class="button is-primary"> Post </button>
      </div>
    </form>

  </div>

</template>

<script>
export default{

  data() {
    return {
      comment: '',
      comments : this.initialcomments,
      type: this.$session.get('type')
    }
  },

  mounted(){
    //this.refresh();
  },
  props: ['initialMina','initialcomments'],

  created(){
    console.log(this.initialcomments);
  },

  methods: {

    calcDate(date){
      var comp = new Date(date);
      var minDigit = "";
      if(comp.getMinutes() < 10)
      minDigit = "0";

      return comp.getFullYear() + "/" + (comp.getMonth()+1) +
      "/" + comp.getDate() + "(" + comp.getHours() + ":" + minDigit + comp.getMinutes()+')';
    },
    refresh(){
    },
    saveChanges(){
      axios.post('/arena/'+this.initialMina+'/comment', querystring.stringify({
        "comment" : this.comment
      }), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .then(res => {
        this.comments=res.data;
        this.comment='';
        this.initialcomments=res.data;
      })
      .catch(err => {
        alert(err);
      });
    }
  },
  computed:{
    mina(){
      return this.initialMina;
    }
  }
}
</script>
