<script lang="ts">
  import { enhance } from '$app/forms';
</script>

<h1>Sign up</h1>
<form method="post" use:enhance>
  <label><input name="username" id="username" /> Username</label>
  <br />
  <label><input type="password" name="password" id="password" /> Password</label>
  <br />
  <button>Continue</button>
</form>
