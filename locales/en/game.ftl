join = Join
    .prompt = Click here to join the game!
    .success = You joined the game in { $chat }!
    .already_in_game = You have already joined the game in { $chat }!
    .in_another_game = You are already in another game in { $chat }!
    .not_found = Could not find the game to join
    .failure = You cannot join the game now!
    .count = <strong>Number of players:</strong> {$count}
    .recent_list = { $users } joined the game in the last 30 seconds.
    .flee = {$user} has left the game!

leave =
    .success = {$user} has left the game!
    .failure = You cannot leave the game now!

game_init = {$user} has started a new game!
    .minutes_left = { $time ->
        [one] {$time} minute left to join
        *[other] {$time} minutes left to join
    }
    .seconds_left = { $time ->
        [one] {$time} second left to join
        *[other] {$time} seconds left to join
    }
    .not_enough_players = Not enough players to start the game!
    .starting = Starting game...

game =
    .not_started = No game has been started yet!
    .already_started = A game has already been started!
    .end = Game over!
    .roles = <strong>Available Roles:</strong>
    .timer_skipped = <em>Skipping forward...</em>
    .seconds_left = { $time ->
        [one] {$time} second left
        *[other] {$time} seconds left
    }
    .times_up = Time's up!
    .won = 🏆
    .lost = 🫂
    .dead = 💀
    .alive = 😃

events = <strong>Order of Events:</strong>
    .vote = Vote
    .copy = Copy
    .protect = Protect
    .peek = Peek
    .swap = Swap
    .off = Off
    .rotate = Shift
    .reveal = Reveal

copy =
    .end = As the sun set, rumors of identity theft spread through the village.

dusk =
    .end = Night falls...

night =
    .end = The sun rises...

vote = Who do you want to vote for?
    .start = Voting has started!
    .end = Voting has ended!
    .cast = You selected {$user}
    .repeat = You have already voted!
    .tally = Tallying votes...
    .unassigned =
        <strong>Unassigned roles:</strong>
        {$roles}
    .draw = No one received more than one vote!
    .results = At the end of the vote, {$users} { $num ->
                    [one] was
                    *[other] were
                } executed!

game_error =
    .err_assign_roles = Error while assigning roles. Please start a new game.
    .invalid_option = Invalid option
    .invalid_vote = Invalid target: {$user}.
    .not_in_game = You are not in the game in {$chat}!
    .wrong_qn = This question is not for you!

misc =
    .unassigned_role = Role {$idx}
    .unassigned = Unassigned ({$count})
    .peek_role = { $user } is a { $role }
    .self_swap_roles = You swapped roles with { $user }
    .self_role_same = You are still a {$role}
    .self_role_changed = You are now a {$role}
    .self_team_changed = You are now on the {$team} team
    .unknown_user = Someone
    .no_user = No one
    .undefined = Undefined
    .pass = Pass
    .passed = You chose to do nothing.

team =
    .village = Village
    .werewolf = Werewolf
    .tanner = Tanner
    .vampire = Vampire
    .assassin = Assassin
    .alien = Alien
    .synth = Synthetic Alien
    .blob = Symbiote
    .mortician = Mortician

stats =
    <strong>No. of Groups</strong>:  { $count }

    <strong>Won : Lost</strong>
    <em>Total</em>  -  { $won } : { $lost }

    <em> {team.village}</em>  -  { $villageWin } : { $villageLose }

    <em> {team.werewolf}</em>  -  { $werewolfWin } : { $werewolfLose }

    <em> {team.tanner}</em>  -  { $tannerWin } : { $tannerLose }
