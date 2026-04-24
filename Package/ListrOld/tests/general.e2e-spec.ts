import { Listr } from "@root/index.js"

describe('show output from task', () => {
  it('should add a single task', async() => {
    const Context = await new Listr(
      {
        title: 'This task will execute.',
        task: (_, task): Listr =>
          task.newListr([
            {
              title: 'This is a subtask.',
              task: async(): Promise<void> => {}
            }
          ])
      },
      { renderer: 'silent' }
    ).run()

    expect(Context).toBeTruthy()
  })

  it('should be able to return the context on task', async() => {
    const tasks = new Listr(
      [
        {
          title: 'This task will execute.',
          task: (_, task): Listr =>
            task.newListr([
              {
                title: 'This is a subtask.',
                task: async(Context): Promise<void> => {
                  Context.test = true
                }
              }
            ])
        },
        {
          task: (Context): void => {
            Context.test2 = true
          }
        }
      ],
      { renderer: 'silent' }
    )

    const Context = await tasks.run()

    expect(Context).toStrictEqual(tasks.Context)
    expect(Context.test).toBe(true)
    expect(Context.test2).toBe(true)
  })

  it('should be able to inject a different context to subtask', async() => {
    const tasks = new Listr(
      [
        {
          title: 'This task will execute.',
          task: (_, task): Listr =>
            task.newListr(
              [
                {
                  title: 'This is a subtask.',
                  task: async(Context): Promise<void> => {
                    Context.test = true
                  }
                },

                {
                  title: 'This is another subtask.',
                  task: async(Context): Promise<void> => {
                    expect(Context.test).toBe(true)
                  }
                }
              ],
              { Context: {} as Record<'test', boolean> }
            )
        },
        {
          task: (Context): void => {
            Context.test2 = true
          }
        }
      ],
      { renderer: 'silent' }
    )

    const Context = await tasks.run()

    expect(Context).toStrictEqual(tasks.Context)
    expect(Context.test).toBe(undefined)
    expect(Context.test2).toBe(true)
  })

  // Jest timeout does not work here as cloneObject(Context) is eating up all cpu
  // cycles, i.e. the stack frame take a long time to complete.
  it('should not take an unreasonable amount of time to clone a large Context object during error collection', async() => {
    const Context = createLargeNestedObject(6, 8) // About 20Mb
    const start = Date.now()

    try {
      await new Listr(
        [
          {
            title: 'This task will fail.',
            task: (): void => {
              throw new Error('This task failed.')
            }
          }
        ],
        {
          exitOnError: true,
          renderer: 'silent'
        }
      ).run(Context)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch(_: any) {
      // Ignore
    }
    const end = Date.now()

    expect(end - start).toBeLessThan(10000)
  })
})

function createLargeNestedObject(depth: number, branches: number): Record<PropertyKey, any> {
  const obj: Record<PropertyKey, any> = {}

  for (let i = 0; i < branches; ++i) {
    obj['k' + i] = depth === 0 ? 'v' : createLargeNestedObject(depth - 1, branches)
  }

  return obj
}
