import assert from 'assert'
import sinon from 'sinon'
import { Settings } from 'model/settings'
import SettingsStore from 'db/settings'
import { NotFoundError } from 'utils/errors'

describe('Settings', () => {
  describe('vaildateURL', () => {
    it('should return true if the URL is valid', async () => {
      const settings = new Settings()
      const urls = ['https://example.com', 'http://example.com', 'example.com', 'https://example.com/test']
      urls.forEach(url => {
        assert(settings.validateURL(url))
      })
    })

    it('should return false if the URL is invalid', async () => {
      const settings = new Settings()
      const urls = ['https://', '', 'https://example']
      urls.forEach(url => {
        assert(!settings.validateURL(url))
      })
    })
  })

  describe('getServiceName', () => {
    afterEach(() => {
      SettingsStore.prototype.get.restore()
    })

    it('should return one component', async () => {
      const expected = 'value'
      sinon.stub(SettingsStore.prototype, 'get').returns(expected)

      const actual = await new Settings().getServiceName()
      assert(actual === expected)
    })

    it('should return empty string when matched no component', async () => {
      sinon.stub(SettingsStore.prototype, 'get').throws(new NotFoundError())
      const actual = await new Settings().getServiceName()
      assert(actual === '')
    })

    it('should throw error when error returned', async () => {
      sinon.stub(SettingsStore.prototype, 'get').throws(new Error())
      let error
      try {
        await new Settings().getServiceName()
      } catch (e) {
        error = e
      }
      assert(error.name === 'Error')
    })
  })

  describe('setServiceName', () => {
    afterEach(() => {
      SettingsStore.prototype.update.restore()
    })

    it('should return one component', async () => {
      const expected = 'value'
      sinon.stub(SettingsStore.prototype, 'update').returns(expected)

      const actual = await new Settings().setServiceName(expected)
      assert(actual === expected)
    })

    it('should throw error when error returned', async () => {
      sinon.stub(SettingsStore.prototype, 'update').throws(new Error())
      let error
      try {
        await new Settings().setServiceName('')
      } catch (e) {
        error = e
      }
      assert(error.name === 'Error')
    })
  })
})
