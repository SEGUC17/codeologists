<template>
<div>
  <h1>Create a new arena</h1>
  <form action = "/createArena" method="post" @submit.prevent = "create" >
      <input type="text" placeholder="Arena name" v-model = "form.name" required="true"> <br>
      <input type="text" placeholder="Arena address" v-model = "form.address" required="true"> <br>
      <input type="text" placeholder="Arena size" v-model = "form.size" required="true"> <br>
      <input type="text" placeholder="Arena location" v-model = "form.location" required="true"> <br>
      <input type="text" placeholder="Arena type" v-model = "form.type" required="true"> <br>
      <input type="text" placeholder="Arena price" v-model = "form.price" required="true"> <br>
      <input type="text" placeholder="Rules and regulations" v-model = "form.rules_and_regulations"> <br>

      <!--Start of the schedule part-->
      <h5>{{days[currentDay]}}</h5>
      <div class="w3-dropdown-hover">
        <button class="w3-button w3-black">Choose Day</button>
        <div class="w3-dropdown-content w3-bar-block w3-border">
          <a v-for="i in 7" class="w3-bar-item w3-button" @click="selectDay(i-1)">{{days[i-1]}}</a>
        </div>
      </div>


      <table v-for="j in 7" v-if="j-1==currentDay" class="table is-bordered">
        <tr>
          <td v-for="i in 12" :class="{ 'w3-pale-red': schedule[j-1][i-1]==-1, 'w3-pale-green': schedule[j-1][i-1]==0 }">
            <p>{{slots[i-1]}}</p>
            <input type="checkbox" name="daySlot" @click="toggleSlot(j-1,i-1)" :checked="schedule[j-1][i-1]==-1">
          </td>
        </tr>

        <tr>
          <td v-for="i in 12" :class="{ 'w3-pale-red': schedule[j-1][i+11]==-1, 'w3-pale-green': schedule[j-1][i+11]==0 }">
            <p>{{slots[11+i]}}</p>
            <input type="checkbox" name="daySlot" @click="toggleSlot(j-1,i+11)" :checked="schedule[j-1][11+i]==-1">
          </td>
        </tr>

        <tr>
          <td v-for="i in 12" :class="{ 'w3-pale-red': schedule[j-1][23+i]==-1, 'w3-pale-green': schedule[j-1][23+i]==0 }">
            <p>{{slots[23+i]}}</p>
            <input type="checkbox" name="daySlot" @click="toggleSlot(j-1,i+23)" :checked="schedule[j-1][23+i]==-1">
          </td>
        </tr>

        <tr>
          <td v-for="i in 12" :class="{ 'w3-pale-red': schedule[j-1][35+i]==-1, 'w3-pale-green': schedule[j-1][35+i]==0 }">
            <p>{{slots[35+i]}}</p>
            <input type="checkbox" name="daySlot" @click="toggleSlot(j-1,i+35)" :checked="schedule[j-1][35+i]==-1">
          </td>
        </tr>
      </table>


      <!--End of the schedule part-->

      <div class="control">
        <button class="button is-primary">Add Arena</button>
      </div>
  </form>

</div>
</template>

<script>
  export default{
    data() {
      return {
        form: new Form({
          name: '',
          address: '',
          location: '',
          size: '',
          type: '',
          price:'',
          rules_and_regulations:'',
          saturday:[],
          sunday:[],
          monday:[],
          tuesday:[],
          wednesday:[],
          thursday:[],
          friday:[]
        }),
        schedule: [],
        slots: [],
        days: [],
        currentDay: 0
      }
    },

    created(){
      this.schedule = new Array(7);
      for (var i = 0; i < 7; i++) {
        this.schedule[i] = new Array(48).fill(0);
      }
      this.slots = new Array(48);
      var start = 11;
      var am = true;
      for (var i = 0; i < 48; i += 2) {
        var t1 = (start % 12 + 1) + ":00";
        var t2 = (start % 12 + 1) + ":30";
        var t3 = ((start + 1) % 12 + 1) + ":00";
        this.slots[i] = t1 + " : " + t2 + (am ? " AM" : " PM");
        this.slots[i + 1] = t2 + " : " + t3 + (am ? " AM" : " PM");
        start++;
        if (i == 22)
          am = false;
      }

      this.days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      this.currentDay = 0;

    },

    methods: {
      create(){
        var arr = new Array(7);
        for (var i = 0; i < 7; i++) {
          arr[i] = [];
        }
        for (var ii = 0; ii < 7; ii++) {
          for (var jj = 0; jj < 48; jj++) {
            if(this.schedule[ii][jj] == -1)
              arr[ii].push(jj);
          }
        }

        this.form.saturday = arr[0];
        this.form.sunday = arr[1];
        this.form.monday = arr[2];
        this.form.tuesday = arr[3];
        this.form.wednesday = arr[4];
        this.form.thursday = arr[5];
        this.form.fri = arr[6];

        this.form.submit('post','/createArena')
				.then(res => {
          if(res.error)
            alert(res.error);
          else
					     alert('arena added');
				})
				.catch(err => {
          if(err.error)
            alert(err.error);
          if(err.response.data.error)
            alert(err.response.data.error);
          else
					     alert(err.message);
				});
      },

      selectDay(day) {
        this.currentDay = day;
      },

      toggleSlot(day, slot) {
        if (this.schedule[day][slot] == 0) {
          this.schedule[day][slot] = -1;
        } else {
          this.schedule[day][slot] = 0;
        }
      },
    }
  }
</script>
