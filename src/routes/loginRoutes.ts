import { Router, Request, Response, NextFunction } from 'express';

interface RequestWithBody extends Request {
  body: { [key: string]: string | undefined }
}

const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (req.session && req.session.loggedIn) {
    next();
    return;
  }

  res.status(403);
  res.send('Not permitted');
};

const router = Router();

router.get('/login', (req: Request, res: Response): void => {
  res.send(`
    <form method="POST">
        <div>
            <label>Email</label>
            <input type="email" name="email"/>
        </div>
        <div>
            <label for="">Password</label>
            <input type="password" name="password">
        </div>
        <button>Submit</button>
    </form>
  `);
});

router.post('/login', (req: RequestWithBody, res: Response): void => {
  const { email, password } = req.body;

  if (email && password && email === 'hi@hi.com' && password === 'password') {
    req.session = { loggedIn: true };
    res.redirect('/');
  } else {
    res.send('Invalid email or password');
  }
});

router.get('/', (req: Request, res: Response): void => {
  if (req.session && req.session.loggedIn) {
    res.send(`
      <div>
        <div>You are logged in</div>
        <a href="/logout">Logout</a>
      </div>
    `);
  } else {
    res.send(`
      <div>
        <div>You are not logged in</div>
        <a href="/login">Login</a>
      </div>
    `);
  }
});

router.get('/logout', (req: Request, res: Response): void => {
  req.session = undefined;
  res.redirect('/');
});

router.get('/protected', requireAuth, (req: Request, res: Response): void => {
  res.send('Welcome to protected route logged user!');
});

export { router };
