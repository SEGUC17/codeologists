<template>
	<div>
		<div v-for="arena in arenas">
			<el-card class="box-card">
				<div class="clearfix">
					<p style="float: left;">{{arena.name}}</p>
					<el-button style="float: right;">
						<router-link :to="getUrl(arena)">
							<a>Edit Current Schedule</a>
						</router-link>
					</el-button>
					<el-button @click.native="editClicked(arena)" style="float: right;" class="w3-margin-right">
						<router-link to="/editArena">
							<a>Edit</a>
						</router-link>
					</el-button>
				</div>
			</el-card>
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
