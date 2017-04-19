<template>

  <div>
    <div>
      <div class="message-header">
        <p> Player </p>
        <p> Comment </p>
        <p>Time Stamp</p>
      </div>
      <div class="message-header" v-for="comment in comments">
        <p>{{	comment.player }}</p>
        <p>{{	comment.Content }}</p>
        <p>{{	comment.time_stamp }}</p>
      </div>
    </div>

    <form method = "post" action="/arena/58e64eef165cf62ff5b25b0f/comment" @submit.prevent="saveChanges">
      <div>
        <label for="name" class= "label"> Write a comment </label>

        <input type="text" id="comment" name="comment" class = "input" v-model="comment">
      </div>

      <div class="control">
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
  .then(res => this.comments=res.data.comments)
  .catch(err => console.log(err));
  },

  methods: {

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
