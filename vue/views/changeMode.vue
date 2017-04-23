<template>
<div>
<label>Toggle the Mode    :</label>
<label class="switch">
  <input type="checkbox" v-on:click="notify()" :checked="mode" >
  <div class="slider round"></div>
</label>
</div>
</template>

<style >

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {display:none;}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>


<script >
export default {
		data(){
			return {
        mode : false
			}
		},

		created(){ 
			axios.get('/getTheMode')
        .then(res => {
          this.mode = res.data.mode;
        })
        .catch(err => {
        });
		},

		methods : {
			notify(){
        console.log(this.mode);
        if(this.mode)
        {
           axios.post('/turnAcceptModeOff')
          .then(res => {
            this.mode = false;
          })
          .catch(err => {
            this.$router.push('/');
          });
        }
        else
        {
          axios.post('/turnAcceptModeOn')
          .then(res => {
            this.mode = true;
          })
          .catch(err => {
            this.$router.push('/');
          });
        }
      }
		}
	}
</script>