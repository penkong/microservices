// ------------------------ Packages --------------------------

import request from 'supertest'
import mongoose from 'mongoose'

// ------------------------ Local --------------------------

import { app } from '../../app'
import { natsWrapper } from '../../nats-wrapper'

// ---------------------------------------------------------

const createTicketHelper = (title: string) => {
  return request(app)
    .post(`/api/tickets/`)
    .set('Cookie', global.signup())
    .send({
      title,
      price: 4
    })
}

const id = () => new mongoose.Types.ObjectId().toHexString()

it('returns a 404 if the provided id does not exist', async () => {
  await request(app)
    .put(`/api/tickets/${id()}`)
    .set('Cookie', global.signup())
    .send({ title: 'fdsfsdf', price: 30 })
    .expect(404)
})

it('returns a 401 if user not authenticated', async () => {
  await request(app)
    .put(`/api/tickets/${id()}`)
    .send({ title: 'fdsfsdf', price: 30 })
    .expect(401)
})

it('returns a 401 if user does not owned ticket', async () => {
  const res = await createTicketHelper('sht')
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', global.signup())
    .send({ title: 'sht', price: 4 })
    .expect(401)
})

it('returns a 400 if user provided an invalid title or price', async () => {
  const cookie = global.signup()

  const res = await request(app)
    .post('/api/tickets/')
    .set('Cookie', cookie)
    .send({
      title: 'title1',
      price: 4
    })

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 4 })
    .expect(400)

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'title1', price: -19 })
    .expect(400)
})

it('returns updated ticket provided valid inputs', async () => {
  const cookie = global.signup()

  const res = await request(app)
    .post('/api/tickets/')
    .set('Cookie', cookie)
    .send({
      title: 'title1',
      price: 4
    })

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'new title1', price: 5 })
    .expect(200)

  const ticketRes = await request(app)
    .get('/api/tickets/' + res.body.id)
    .send()

  expect(ticketRes.body.title).toEqual('new title1')
  expect(ticketRes.body.price).toEqual(5)
})

it('return a publish event', async () => {
  const cookie = global.signup()

  const res = await request(app)
    .post('/api/tickets/')
    .set('Cookie', cookie)
    .send({
      title: 'title1',
      price: 4
    })

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'new title1', price: 5 })
    .expect(200)

  // console.log(natsWrapper`)
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
