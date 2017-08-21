# Debug Tips:
if you want to debug local project :-
1. killall node
2. Tern determines project dir from .tern-project or .tern-config file
so go to that dir and start `tern --port 60788 --verbose` (eg start tern in client dir and not root dir of project)
3. start completions.
4. for starting in inspect mode `node --inspect $(which tern) --port 60788 --verbose`
(if something is not working most probably another process is still alive, or wrong dir, (tern server creates a .tern-port file look for the port in that.))

