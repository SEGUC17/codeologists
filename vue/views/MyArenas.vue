<template>

	<div>
		<div class="" v-for = "arena in arenas" style="padding-left: 5cm;">
	      <el-card class="box-card">
	        <div slot="header" class="clearfix ">
	          <span style="line-height: 36px; font-size: 20px; font-weight: bold;">{{arena.name}}</span>
	            <router-link :to="getUrl(arena)">
		    		<el-button style="float: right;" type="danger">Edit Current Schedule</el-button>
		    	</router-link>
	        </div>
	        <div>
	          <table>
	            <tr style="font-size: 18px">
	              <td>Location: {{arena.location}}</td>
	              <td>
	              	<router-link to="/editArena" v-on:click.native="editClicked(arena)">
		    			<el-button style="float: right;" type="danger" >Edit</el-button>
		    		</router-link>
	              </td>
	            </tr>
	          </table>
	        </div>
	      </el-card>
	      <br><br>
    	</div>

	</div>

</template>


<script>

export default {
	data() {
		return {
			arenas: []
		}
	},

	created() {
		axios.get('/myArenas')
		.then(res => this.arenas = res.data)
		.catch(err => console.log(err));
	},

	methods: {
		editClicked(arena) {
			Event.$emit('edit-arena', arena);
		},

		getUrl(arena){
			return "/editSchedule/"+arena.name;
		}
	}
}

</script>
