import { interval, from } from 'rxjs'
import { distinctUntilChanged, flatMap, filter, tap, map } from 'rxjs/operators'
import * as notifier from 'node-notifier'
import * as clipboardy from 'clipboardy'
import * as path from 'path'

const replacements = [
  { from: 'awesome', to: 'AWESOME' },
  { from: 'super', to: 'SUPER' }
]

interval(800)
.pipe(
  flatMap(x => from<string>(clipboardy.read())),
  distinctUntilChanged(),
  filter(x => replacements.some(r => x.includes(r.from))),
  map(x => replace(x, replacements)),
  tap(x => clipboardy.writeSync(x))
).subscribe(res => {
  notifier.notify({
    title: 'ACRM',
    message: 'replaced!',
    icon: path.join(__dirname, '../icon.png')
  })
})

function replace (input, replacements): string {
  let x = input
  replacements.forEach(r => {
    x = x.replace(r.from, r.to)
  })
  return x
}
