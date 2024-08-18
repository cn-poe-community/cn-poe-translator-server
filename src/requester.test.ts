import { expect, test } from 'vitest'
import { Requester } from './requester.js'

const cookie = ""

const requester = new Requester(cookie)

test('get characters',async () =>  {
   const characters =await requester.getCharacters("客★心", "pc")
   expect(characters.length>0).toBe(true)
})

test('get passive skills',async () =>  {
    const data =await requester.getPassiveSkills("客★心", "客心_开荒II", "pc")
    expect(data!==null).toBe(true)
 })