# Link Sweep

This is the corresponding source code for Link Sweep, the Chrome extension that's sweeping across the web! 

## Purpose

This extension was meant to make my life, as well as the lives of other blog writers, easier. 

Say you just finished writing a blog post. You used a few links as resources that you would like to mention at the end of your post in a 'References' or 'Resources' section. You can either...

a) Go through your post again, copying all of the links one by one and pasting them in the 'References' or 'Resources' section.

b) As you write, copy and paste your links in another app, such as Notepad, and then at the end copy all of them from your third party app and back into the blog post.

c) Download Link Sweep and copy all links in the click of a button. Once copied, you can paste them whenever you want!

With option C, you save time and can focus on what's most important: writing. 

- There's no need to run through it again and hoping you didn't miss any links.

- There's no need to use a third party app where you have to constantly go between that and your blogging platform.

You can stay within your browser, and within your browser window in which you're currently writing and have all of your references ready to go in the click of a button.

## Usage

1. Download it from the Chrome Web Store.
2. Pin it to your extensions.
3. Start writing, either on Medium or Blogger.
4. When you're done writing and you want to collect all of the links in your post, click the extension. 
5. Paste the aggregated links wherever you please.

## Why not use a regular popup?

Something that I noticed that made the clipboard copying difficult was that the webpage needed to be focused. However, when an extension popup is open, it is removing focus from the webpage. 

Only when I immediately clicked the webpage after clicking the extension AND executed the copy logic after a one second time out did it work. 

Not user friendly at all.

To maintain focus I decided to just insert my own custom popup after clicking the extension. A bit of a hack but it was the only way I could ensure smooth UX and consistent copying via `navigator.clipboard...`.

## Support

- Medium
- Blogger
- Tumblr

I am working on adding support for other platforms (and feel free to comment some suggestions!)

## Video Demo

Check out the video demo available now on [YouTube](https://www.youtube.com/watch?v=wz4koHtigmU&t=1s)!

[Upgrade your free Medium membership](https://matt-croak.medium.com/membership) and receive unlimited, ad-free, stories from thousands of writers on a wide variety of publications. This is an affiliate link and a portion of your membership helps me be rewarded for the content I create.

You can also [subscribe via email](https://matt-croak.medium.com/subscribe) and get notified whenever I post something new!

Connect with me on socials, or pay an invoice [here](https://linktr.ee/mattcroak)!

