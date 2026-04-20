*&copy; 2026 Gage Sorrell *et al.*  Released under the [MIT license](./License.md).*

# `@sorrell/listr`

This is a fork of [`listr2`](https://github.com/listr2/listr2/tree/master/packages/listr2).
It removes the following features,

* multiple renderers (it retains only the `ListrDefaultRenderer`)
* `exitOnError?: boolean;` option

and adds the following features,

* [`tensed?: boolean;`](#tensed-boolean)
* [a custom return strategy (including errors-as-values)](#return-strategy)

## Documentation

### `tensed?: boolean;`

If the `tensed` property is `true` for a given task, then its title will be required to begin with a *present participle*--that is, a verb that ends with `ing` (this is enforced by the type system).
If the task ends successfully, then the starting verb is changed to its *simple past tense* form; if it fails, then the `"Failed to "` is prepended to the title, its starting verb is uncapitalized, and the starting verb is changed to its *unconjugated* form.
An optional `Exit` return strategy is given, which allows you to specify a custom title.
See [§Return Strategy](#return-strategy) for more details.

### Return Strategy

All tasks must return one of the values belonging to the member property `Listr.Return`.
Its properties are summarized below.

#### `Success`

Return this value to indicate that the task completed successfully.
This will cause the task's title to be set as described in [§`tensed?: boolean;`](#tensed-boolean).

#### `Failure(Die: TaskDeath = false)`

Return this value to indicate that the task completed erroneously.
If `Die.Die === true`, then the parent task will exit early.
Other options are described in [§`TaskDeath`](#taskdeath).

##### `TaskDeath`

* `@property Die` - Whether the parent task should exit early.
* `@property Completely` - If supplied, and `Die === true`, then the *root* task will exit.
* `@property Message` - If `Die === true`, then this message will be displayed below the tasks.  The static property `Listr.DeathMessagePrefix` is prepended to the message (with a space).  Ignored if `Completely === false` or if the parent task is *not* the root task.
* `@property TaskTitle` - If supplied, and `Die === true`, then the task's title will become this.

```typescript
type TaskDeath =
    | false
    | {
        Die: false;
    }
    | {
        Die: boolean;
        Completely?: boolean;
        Message?: string;
        TaskTitle?: string;
    }
    | {
        Die: true;
        Completely?: boolean;
        Message: string;
        TaskTitle?: string;
    };
```
Return this value to indicate that the task completed erroneously.

This will cause the task's title to be set as described in [§`tensed?: boolean;`](#tensed-boolean).

#### `Exit(CustomTitle: string, State?: ListrDefaultRendererLogLevels);`

Return a call to this function to indicate that the task ended in a nontrivial state, such that the title becomes a `CustomTitle` to convey this final state, which is something other than the expected, simple success or failure.

#### `Subtasks<NewContextType>(Subtasks: TMaybeArray<ListrTask<NewContextType>>, Finally: (FinallyArgument: FinallyArgument<ContextType, NewContextType>) => SubtasksResult<ContextType>);`

Return a call to this function to specify a set of subtasks, and a function that accepts the task in which this function was called, and returns a `SubtasksResult`, to determine (as a function of the parent tasks's and subtasks's contexts) whether the parent task succeeded or failed (or neither, in which case a custom title is returned).

##### `FinallyArgument<ContextType, NewContextType>`

* `@property Context` - The context of the task from which `Listr<ContextType>.Return.Subtasks` was called.
* `@property SubtasksContext` - The context of the subtasks.
* `@property ThisTask` - The task containing the subtasks returned by calling `Listr<ContextType>.Return.Subtasks`, *i.e.*, the parent task of the subtasks.

```typescript
type FinallyArgument<ContextType, NewContextType> =
{
    Context: ContextType;
    SubtasksContext: NewContextType;
    ThisTask: ListrTask<ContextType>;
};
```

##### `SubtasksResult`

Identical to `typeof Listr<ContextType>.Return`, but without the `Subtasks` function, since this type exists to determine simply *how* the task containing the subtasks completed.

```typescript
type SubtasksResult<ContextType> = Omit<ListrResult<ContextType>, "Subtasks">;
```

---

*The original [`listr2` `README.md` may be found here.](https://github.com/listr2/listr2/blob/master/packages/listr2/README.md)*
