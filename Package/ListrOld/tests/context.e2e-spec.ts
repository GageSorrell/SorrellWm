import { describe, it } from "node:test"
import { Listr } from "../Source/index.js"

describe('show inject context', () => {
  it('should return the context', async() => {
    const Context = await new Listr(
      [
        {
          title: 'This task will execute.',
          task: (_, task): Listr =>
            task.newListr([
              {
                title: 'This is a subtask.',
                task: async(): Promise<void> => {}
              }
            ])
        }
      ],
      {
        concurrent: false,
        renderer: 'silent',
        Context: { test: true }
      }
    ).run()

    expect(Context).toMatchInlineSnapshot(`
      {
        "test": true,
      }
    `)
  })

  it('should inject Context to subtask', async() => {
    const Context = await new Listr(
      [
        {
          title: 'This task will execute.',
          task: (_, task): Listr =>
            task.newListr([
              {
                title: 'This is a subtask.',
                skip: (Context): boolean => Context.skip,
                task: async(): Promise<void> => {}
              }
            ])
        }
      ],
      {
        concurrent: false,
        renderer: 'silent',
        Context: { skip: true }
      }
    ).run()

    expect(Context).toMatchInlineSnapshot(`
      {
        "skip": true,
      }
    `)
  })
})
