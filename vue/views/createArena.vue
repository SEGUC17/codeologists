<template>
<div class="w3-container">


  <div class="w3-quarter">
    &nbsp
  </div>

<div class = "w3-half" style = "width: 900px">
  <br>
  <h1>Create a new arena</h1>
  <el-steps :space="100" :active="active" finish-status="success">
    <el-step title="Step 1"></el-step>
    <el-step title="Step 2"></el-step>
  </el-steps>
  <form action = "/createArena" method="post" @submit.prevent = "create">

      <!-- Start of info part -->
      <div style = "width: 720px" name = "info" id = "info" v-if = "this.active == 0">
        <div class="field">
          <br><br>
        <label class="label">Arena Name:</label>
        <p class="control">
          <input class="input "type="text" placeholder="Arena name" v-model = "form.name" required="true"> <br>
        </p>
        </div>

        <div class="field">
        <label class="label">Arena address:</label>
        <p class="control">
          <input class="input"  type="text" placeholder="Arena address" v-model = "form.address" required="true"> <br>
        </p>
        </div>

        <div class="field">
        <label class="label">Arena size:</label>
        <p class="control">
          <input class="input"  type="text" placeholder="Arena size" v-model = "form.size" required="true" onkeypress='return event.charCode >= 48 && event.charCode <= 57 || event.charCode < 10 '> <br>
        </p>
        </div>

        <div class="field">
        <label class="label">Arena location:</label>
        <p class="control">
          <input class="input" type="text" placeholder="Arena location" v-model = "form.location" required="true"> <br>
        </p>
        </div>

        <div class="field">
        <label class="label">Arena type:</label>
        <p class="control">
          <input class="input"  type="text" placeholder="Arena type" v-model = "form.type" required="true"> <br>
        </p>
        </div>

        <div class="field">
        <label class="label">Arena price:</label>
        <p class="control">
          <input class="input"  type="text" placeholder="Arena price" v-model = "form.price" required="true" onkeypress='return event.charCode >= 48 && event.charCode <= 57 || event.charCode < 10 '> <br>
        </p>
        </div>

        <div class="field">
        <label class="label">Rules and regulations:</label>
        <p class="control">
        <textarea class="textarea" placeholder="Rules and regulations" v-model = "form.rules_and_regulations"></textarea><br></p>
        </div>
      </div>
      <!-- End of info part -->

      <!--Start of the schedule part-->
      <div name = "schedule" id = "shcedule" v-if = "this.active == 1" style="width: 900px;">
        <br>
        <h3>Adjust your default weekly schedule</h3>
        <!-- <h5>{{days[currentDay]}}</h5>
        <div class="w3-dropdown-hover">
              <button class="w3-button w3-black" @click.prevent>Choose a day</button>
            </tr>
          </table>
          <div class="w3-dropdown-content w3-bar-block w3-border">
            <a v-for="i in 7" class="w3-bar-item w3-button" @click="selectDay(i-1)">{{days[i-1]}}</a>
          </div>
        </div> -->

        <div class="tabs ">
    		  <ul>
    		    <li :class="{'black-tab' : selectedTab=='sat'}">
              <a @click="selectedTab='sat'; currentDay = 0">
                <h6 :class="{'white-text': selectedTab == 'sat'}">Saturday</h6>
              </a>
            </li>
    		    <li :class="{'black-tab' : selectedTab=='sun'}">
              <a @click="selectedTab='sun'; currentDay = 1">
                <h6 :class="{'white-text': selectedTab == 'sun'}">Sunday</h6>
              </a>
            </li>
    		    <li :class="{'black-tab' : selectedTab=='mon'}">
              <a @click="selectedTab='mon'; currentDay = 2">
                <h6 :class="{'white-text': selectedTab == 'mon'}">Monday</h6>
              </a>
            </li>
            <li :class="{'black-tab' : selectedTab=='tues'}">
              <a @click="selectedTab='tues'; currentDay = 3">
                <h6 :class="{'white-text': selectedTab == 'tues'}">Tuesday</h6>
              </a>
            </li>
    		    <li :class="{'black-tab' : selectedTab=='wed'}">
              <a @click="selectedTab='wed'; currentDay = 4">
                <h6 :class="{'white-text': selectedTab == 'wed'}">Wednesday</h6>
              </a>
            </li>
    		    <li :class="{'black-tab' : selectedTab=='thurs'}">
              <a @click="selectedTab='thurs'; currentDay = 5">
                <h6 :class="{'white-text': selectedTab == 'thurs'}">Thursday</h6>
              </a>
            </li>
            <li :class="{'black-tab' : selectedTab=='fri'}">
              <a @click="selectedTab='fri'; currentDay = 6">
                <h6 :class="{'white-text': selectedTab == 'fri'}">Friday</h6>
              </a>
            </li>
    		  </ul>
    		</div>


        <table v-for="j in 7" v-if="j-1==currentDay" class="table is-bordered">
          <tr>
            <td v-for="i in 12" >
              <div @click="toggleSlot(j-1,i-1)">
                <a >
                  <p>{{slots[i-1]}}</p>
                  <img v-if = "schedule[j-1][i-1] == -1" src="cross.png">
                  <img v-if = "schedule[j-1][i-1] == 0" src="tick.png">
                </a>
            </div>
            </td>
          </tr>

          <tr>
            <td v-for="i in 12">
              <div @click="toggleSlot(j-1,i+11)">
                <a >
                  <p>{{slots[i+11]}}</p>
                  <img v-if = "schedule[j-1][i+11] == -1" src="cross.png">
                  <img v-if = "schedule[j-1][i+11] == 0" src="tick.png">
                </a>
              </div>
            </td>
          </tr>

          <tr>
            <td v-for="i in 12">
              <div @click="toggleSlot(j-1, i+23)">
                <a >
                  <p>{{slots[i+23]}}</p>
                  <img v-if = "schedule[j-1][i+23] == -1" src="cross.png">
                  <img v-if = "schedule[j-1][i+23] == 0" src="tick.png">
                </a>
              </div>
            </td>
          </tr>

          <tr>
            <td v-for="i in 12" >
              <div @click = "toggleSlot(j-1, i+35)">
                <a >
                  <p>{{slots[i+35]}}</p>
                  <img v-if = "schedule[j-1][i+35] == -1" src="cross.png">
                  <img v-if = "schedule[j-1][i+35] == 0" src="tick.png">
                </a>
              </div>
            </td>
          </tr>
        </table>
      </div>
      <!--End of the schedule part-->

      <el-button class = "button is-primary" :disabled="form.name === ''
      || form.address === '' || form.location === '' || form.size === '' || form.type === '' || form.price === ''"
       v-if = "active == 0" @click="next">Next</el-button>
      <table>
        <tr>
          <td><el-button class = "button is-primary" @click="next" v-if = "active == 1">Back</el-button>
          </td>
          <td><div class="control" v-if = "active == 1">
            <button class="button is-primary">Add Arena</button>
          </div></td>
        </tr>
      </table>
  </form>

<br>
</div>
<div class="w3-quarter">
&nbsp
</div>
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
        currentDay: 0,
        active: 0,
        selectedTab : 'sat'
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
        this.form.friday = arr[6];

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
        this.currentDay += 1;
        this.currentDay -= 1;
      },

      next() {
       this.active = this.active== 0?1:0;
     }
    }
  }
</script>
