<template>

  <div>
    <h4 class="w3-margin-left"> Comments </h4>
    <div>
      <div v-for="(comment,index) in comments">

        <div class="box w3-twothird w3-margin-left w3-display-container">
          <article class="media">
            <div class="media-content">
              <div class="content">
                <p>
                  <strong>{{	comment.player }}</strong>
                  <small class="w3-display-topright w3-padding-16 w3-margin-right ">{{	calcDate(comments[index].time_stamp) }}</small>
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

    <form class="w3-twothird w3-padding-16" method = "post" action="/arena/58e64eef165cf62ff5b25b0f/comment" @submit.prevent="saveChanges">
      <div>
        <input type="text" id="comment" placeholder = "Write a comment .." name="comment" class = "input w3-margin-left" v-model="comment">
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
      comments : [],
      id:'58e64eef165cf62ff5b25b0f'
    }
  },


  created(){
    axios.get('/arena/'+this.id+'/getComments')
    .then(res => this.comments = res.data.comments)
    .catch(err => console.log(err));
  },

  methods: {

    calcDate(date){
      var comp = new Date(date);
      return comp.getFullYear() + "/" + (comp.getMonth()+1) +
      "/" + comp.getDate() + "(" + comp.getHours() + ":" + comp.getMinutes()+')';
    },

    saveChanges(){
      axios.post('/arena/'+this.id+'/comment', querystring.stringify({
        "comment" : this.comment
      }), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .then(res => {
        this.comments.push(res.data.comment)
      })
      .catch(err => {
        alert(err);
      });
    }
  }
}
</script>
